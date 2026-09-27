#!/bin/sh

# One-shot diagnostic collector for CapRover system-service failures.
# Designed for Debian/Ubuntu hosts using Docker Swarm.
#
# The script does not update, restart, scale, stop, or remove services.
# It avoids printing Docker environment variables and CapRover configuration
# file contents because those may contain credentials.
# It does start two temporary containers when their images are already local.
# Logs, process arguments, and package history can still contain private data;
# inspect the report before sharing it.

set +e
export LC_ALL=C
export LANG=C
umask 077

if [ "$(id -u)" -ne 0 ]; then
    printf '%s\n' "Run this script as root:" >&2
    printf '  sudo %s\n' "$0" >&2
    exit 1
fi

REPORT=$(mktemp /tmp/caprover-diagnostic.XXXXXX.txt) || exit 1

section() {
    printf '\n\n================================================================\n'
    printf '%s\n' "$1"
    printf '================================================================\n'
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

timestamp() {
    date --iso-8601=seconds 2>/dev/null || date
}

main() {
    section "CAPROVER ONE-SHOT DIAGNOSTIC"
    printf 'Started: %s\n' "$(timestamp)"
    printf 'Report: %s\n' "$REPORT"
    printf 'Script PID: %s\n' "$$"

    section "1. HOST AND OPERATING SYSTEM"
    date
    uname -a
    hostnamectl 2>&1
    printf '\n'
    cat /etc/os-release 2>&1
    printf '\n'
    uptime
    printf '\n'
    systemd-detect-virt 2>&1
    printf '\n'
    last reboot 2>&1 | head -10

    section "2. CPU, MEMORY, SWAP, AND LOAD"
    free -h
    printf '\n'
    swapon --show 2>&1
    printf '\n'
    cat /proc/loadavg
    printf '\n'
    ps aux --sort=-%mem | head -20
    printf '\n'
    ulimit -a

    section "3. STORAGE AND INODES"
    df -hT
    printf '\n'
    df -ih
    printf '\n'
    findmnt -T / 2>&1
    findmnt -T /captain 2>&1
    findmnt -T /var/lib/docker 2>&1
    printf '\n'
    timeout 30s du -xhd1 /captain 2>&1 | sort -h
    printf '\n'
    timeout 30s du -xhd1 /var/lib/docker 2>&1 | sort -h | tail -30

    section "4. LISTENERS ON CAPROVER PORTS"
    PORT_DATA=$(ss -H -ltnp '( sport = :80 or sport = :443 or sport = :3000 )' 2>&1)
    printf '%s\n' "$PORT_DATA"
    printf '\nAdditional socket information:\n'
    ss -ltnp 2>&1 | head -200

    section "5. PROCESSES OWNING PORTS 80, 443, OR 3000"
    PIDS=$(printf '%s\n' "$PORT_DATA" | grep -oE 'pid=[0-9]+' | cut -d= -f2 | sort -nu)

    if [ -z "$PIDS" ]; then
        printf '%s\n' "No owning PID was reported by ss."
    else
        for PID_VALUE in $PIDS; do
            printf '\n---------------- PID %s ----------------\n' "$PID_VALUE"
            ps -p "$PID_VALUE" \
                -o pid,ppid,lstart,etime,user,group,stat,%cpu,%mem,args \
                --no-headers 2>&1

            printf 'Executable:\n'
            readlink -f "/proc/$PID_VALUE/exe" 2>&1

            printf 'Command line:\n'
            tr '\000' ' ' < "/proc/$PID_VALUE/cmdline" 2>/dev/null
            printf '\n'

            printf 'Cgroups:\n'
            cat "/proc/$PID_VALUE/cgroup" 2>&1

            printf 'Systemd ownership/status:\n'
            systemctl status "$PID_VALUE" --no-pager -l 2>&1 | head -100
        done
    fi

    section "6. COMMON HOST WEB SERVERS"
    for UNIT_NAME in nginx apache2 httpd caddy haproxy traefik; do
        printf '\n---------------- %s ----------------\n' "$UNIT_NAME"
        printf 'Installed/known: '
        systemctl show "$UNIT_NAME" --property=LoadState --value 2>&1
        printf 'Enabled: '
        systemctl is-enabled "$UNIT_NAME" 2>&1
        printf 'Active: '
        systemctl is-active "$UNIT_NAME" 2>&1
        systemctl status "$UNIT_NAME" --no-pager -l 2>&1 | head -40
    done

    printf '\nPotentially relevant socket units:\n'
    systemctl list-sockets --all --no-pager 2>&1 |
        grep -Ei 'LISTEN|http|nginx|apache|caddy|80|443' |
        head -100

    section "7. LOCAL HTTP AND HTTPS RESPONSES"
    for URL_VALUE in \
        http://127.0.0.1/ \
        https://127.0.0.1/ \
        http://127.0.0.1:3000/
    do
        printf '\n---------------- %s ----------------\n' "$URL_VALUE"
        curl -k -sS \
            --connect-timeout 3 \
            --max-time 8 \
            -D - \
            -o /dev/null \
            "$URL_VALUE" 2>&1
    done

    section "8. DOCKER PACKAGES AND RUNTIME VERSIONS"
    timeout 30s docker version 2>&1
    printf '\n'
    timeout 30s docker info 2>&1
    printf '\n'
    containerd --version 2>&1
    runc --version 2>&1
    docker-init --version 2>&1

    printf '\nInstalled Debian/Ubuntu packages:\n'
    dpkg-query -W \
        -f='${Package}\t${Version}\t${Status}\n' \
        docker-ce docker-ce-cli docker.io containerd containerd.io runc \
        2>&1

    section "9. DOCKER SYSTEMD STATUS"
    systemctl status docker containerd --no-pager -l 2>&1
    printf '\n'
    systemctl show docker \
        --property=ActiveState,SubState,UnitFileState,ExecMainStartTimestamp,ExecMainPID,NRestarts \
        2>&1
    printf '\n'
    systemctl show containerd \
        --property=ActiveState,SubState,UnitFileState,ExecMainStartTimestamp,ExecMainPID,NRestarts \
        2>&1

    section "10. DOCKER SOCKET AND API COMPATIBILITY"
    stat -Lc \
        'Path=%n Type=%F Mode=%A Owner=%U:%G Inode=%i' \
        /var/run/docker.sock 2>&1

    if command_exists curl; then
        printf '\nUnversioned Docker API ping:\n'
        curl -sS --max-time 5 \
            --unix-socket /var/run/docker.sock \
            http://localhost/_ping 2>&1
        printf '\n\nDocker API version endpoint:\n'
        curl -sS --max-time 5 \
            --unix-socket /var/run/docker.sock \
            http://localhost/version 2>&1
        printf '\n\nLegacy v1.38 API ping:\n'
        curl -sS -i --max-time 5 \
            --unix-socket /var/run/docker.sock \
            http://localhost/v1.38/_ping 2>&1
        printf '\n'
    fi

    section "11. SWARM STATUS"
    docker node ls 2>&1
    printf '\n'
    docker node inspect self \
        --format 'ID={{.ID}}
Hostname={{.Description.Hostname}}
NodeState={{.Status.State}}
Availability={{.Spec.Availability}}
ManagerReachability={{if .ManagerStatus}}{{.ManagerStatus.Reachability}}{{end}}
EngineVersion={{.Description.Engine.EngineVersion}}
Address={{.Status.Addr}}' \
        2>&1
    printf '\n'
    docker info --format \
        'Swarm={{.Swarm.LocalNodeState}}
NodeID={{.Swarm.NodeID}}
ControlAvailable={{.Swarm.ControlAvailable}}
Managers={{.Swarm.Managers}}
Nodes={{.Swarm.Nodes}}
DockerRoot={{.DockerRootDir}}
StorageDriver={{.Driver}}
CgroupDriver={{.CgroupDriver}}
CgroupVersion={{.CgroupVersion}}' \
        2>&1

    section "12. ALL SWARM SERVICES"
    docker service ls \
        --format 'table {{.ID}}\t{{.Name}}\t{{.Mode}}\t{{.Replicas}}\t{{.Image}}\t{{.Ports}}' \
        2>&1

    printf '\nPublished ports by service:\n'
    docker service ls --format '{{.Name}}' 2>/dev/null |
    while IFS= read -r SERVICE_NAME; do
        [ -n "$SERVICE_NAME" ] || continue
        docker service inspect "$SERVICE_NAME" \
            --format 'Service={{.Spec.Name}}
Image={{.Spec.TaskTemplate.ContainerSpec.Image}}
Ports={{json .Endpoint.Spec.Ports}}' \
            2>&1
    done

    section "13. ALL DOCKER CONTAINERS AND PORT MAPPINGS"
    docker ps -a --no-trunc \
        --format 'table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}' \
        2>&1

    printf '\nContainer state and restart policies:\n'
    docker ps -aq 2>/dev/null |
    while IFS= read -r CONTAINER_ID; do
        [ -n "$CONTAINER_ID" ] || continue
        docker inspect "$CONTAINER_ID" \
            --format 'Name={{.Name}} ID={{.Id}}
Image={{.Config.Image}}
State={{.State.Status}} Running={{.State.Running}} Restarting={{.State.Restarting}} ExitCode={{.State.ExitCode}} Error={{json .State.Error}}
Started={{.State.StartedAt}} Finished={{.State.FinishedAt}}
RestartPolicy={{.HostConfig.RestartPolicy.Name}}
Ports={{json .NetworkSettings.Ports}}' \
            2>&1
    done

    section "14. CAPROVER SYSTEM SERVICE SPECIFICATIONS"
    CAPROVER_SERVICES=$(docker service ls --format '{{.Name}}' 2>/dev/null | grep '^captain-' | sort)

    if [ -z "$CAPROVER_SERVICES" ]; then
        printf '%s\n' "No captain-* Swarm services found."
    else
        for SERVICE_NAME in $CAPROVER_SERVICES; do
            printf '\n================ %s ================\n' "$SERVICE_NAME"

            docker service inspect "$SERVICE_NAME" \
                --format 'Name={{.Spec.Name}}
Created={{.CreatedAt}}
Updated={{.UpdatedAt}}
Image={{.Spec.TaskTemplate.ContainerSpec.Image}}
Replicas={{if .Spec.Mode.Replicated}}{{.Spec.Mode.Replicated.Replicas}}{{end}}
UpdateState={{if .UpdateStatus}}{{.UpdateStatus.State}}{{end}}
UpdateMessage={{if .UpdateStatus}}{{.UpdateStatus.Message}}{{end}}
Ports={{json .Endpoint.Spec.Ports}}
Networks={{range .Spec.TaskTemplate.Networks}}{{.Target}} {{end}}
Constraints={{json .Spec.TaskTemplate.Placement.Constraints}}
Mounts={{range .Spec.TaskTemplate.ContainerSpec.Mounts}}{{.Type}}:{{.Source}}->{{.Target}}; {{end}}
RestartCondition={{if .Spec.TaskTemplate.RestartPolicy}}{{.Spec.TaskTemplate.RestartPolicy.Condition}}{{end}}' \
                2>&1

            printf '\nTasks:\n'
            docker service ps "$SERVICE_NAME" --no-trunc \
                --format 'table {{.ID}}\t{{.Name}}\t{{.Image}}\t{{.Node}}\t{{.DesiredState}}\t{{.CurrentState}}\t{{.Error}}\t{{.Ports}}' \
                2>&1
        done
    fi

    section "15. IMPORTANT CAPROVER SERVICE LOGS"
    for SERVICE_NAME in captain-captain captain-nginx captain-certbot captain-netdata; do
        if docker service inspect "$SERVICE_NAME" >/dev/null 2>&1; then
            printf '\n================ %s, LAST 300 LINES ================\n' "$SERVICE_NAME"
            timeout 30s docker service logs \
                --raw \
                --timestamps \
                --tail 300 \
                "$SERVICE_NAME" 2>&1
        else
            printf '%s does not exist.\n' "$SERVICE_NAME"
        fi
    done

    section "16. CAPROVER HOST DIRECTORY STRUCTURE"
    for PATH_VALUE in \
        /captain \
        /captain/generated \
        /captain/generated/static \
        /captain/generated/static/domains \
        /captain/data \
        /captain/temp
    do
        printf '\n---------------- %s ----------------\n' "$PATH_VALUE"
        stat -Lc \
            'Path=%n Type=%F Mode=%A NumericMode=%a Owner=%U:%G UID=%u GID=%g Size=%s Inode=%i Modified=%y' \
            "$PATH_VALUE" 2>&1
        findmnt -T "$PATH_VALUE" 2>&1
    done

    printf '\nDirectory components and permissions:\n'
    namei -l /captain/generated/static/domains 2>&1

    printf '\nGenerated directory tree, metadata only:\n'
    if [ -e /captain/generated ]; then
        find /captain/generated \
            -maxdepth 3 \
            -printf '%y %M %u:%g %s %TY-%Tm-%TdT%TH:%TM:%TS %p\n' \
            2>&1 |
            sort |
            head -500
    else
        printf '%s\n' "/captain/generated does not exist."
    fi

    section "17. CAPTAIN CONTAINER VIEW OF MOUNTS"
    CAPTAIN_CONTAINER=$(docker ps \
        --filter label=com.docker.swarm.service.name=captain-captain \
        --format '{{.ID}}' 2>/dev/null | head -1)

    if [ -z "$CAPTAIN_CONTAINER" ]; then
        printf '%s\n' "No running captain-captain container found."
    else
        printf 'Captain container: %s\n' "$CAPTAIN_CONTAINER"

        docker inspect "$CAPTAIN_CONTAINER" \
            --format 'Name={{.Name}}
Image={{.Config.Image}}
State={{.State.Status}}
Started={{.State.StartedAt}}
Mounts={{range .Mounts}}{{.Type}}:{{.Source}}->{{.Destination}} RW={{.RW}}; {{end}}' \
            2>&1

        printf '\n'
        docker exec "$CAPTAIN_CONTAINER" sh -c '
            echo "Identity:"
            id

            echo
            echo "Docker socket:"
            ls -l /var/run/docker.sock 2>&1
            test -S /var/run/docker.sock
            echo "Docker socket test exit code: $?"

            echo
            echo "Captain paths as seen inside container:"
            for p in \
                /captain \
                /captain/generated \
                /captain/generated/static \
                /captain/generated/static/domains \
                /captain/data \
                /captain/temp
            do
                stat -Lc \
                    "Path=%n Type=%F Mode=%A Owner=%U:%G Inode=%i Modified=%y" \
                    "$p" 2>&1
            done
        ' 2>&1
    fi

    section "18. CAPROVER OVERLAY NETWORKS"
    docker network ls \
        --format 'table {{.ID}}\t{{.Name}}\t{{.Driver}}\t{{.Scope}}' \
        2>&1

    for NETWORK_NAME in captain-overlay-network docker_gwbridge ingress; do
        if docker network inspect "$NETWORK_NAME" >/dev/null 2>&1; then
            printf '\n---------------- %s ----------------\n' "$NETWORK_NAME"
            docker network inspect "$NETWORK_NAME" \
                --format 'Name={{.Name}}
ID={{.Id}}
Driver={{.Driver}}
Scope={{.Scope}}
Internal={{.Internal}}
Attachable={{.Attachable}}
Ingress={{.Ingress}}
IPAM={{json .IPAM.Config}}
Options={{json .Options}}
Peers={{json .Peers}}' \
                2>&1
        fi
    done

    section "19. DOCKER AND CONTAINERD ERRORS FROM CURRENT BOOT"
    journalctl -b \
        -u docker \
        -u containerd \
        --no-pager \
        -o short-iso 2>&1 |
        grep -Ei 'error|failed|failure|fatal|panic|runc|shim|address already in use|port|mount|network|oom|killed|denied|unauthorized' |
        tail -800

    section "20. DOCKER AND CONTAINERD ERRORS FROM PREVIOUS BOOT"
    journalctl -b -1 \
        -u docker \
        -u containerd \
        --no-pager \
        -o short-iso 2>&1 |
        grep -Ei 'error|failed|failure|fatal|panic|runc|shim|address already in use|port|mount|network|oom|killed|denied|unauthorized' |
        tail -500

    section "21. KERNEL, OOM, FILESYSTEM, AND RUNTIME ERRORS"
    journalctl -k \
        --since '30 days ago' \
        --no-pager \
        -o short-iso 2>&1 |
        grep -Ei 'out of memory|oom|killed process|segfault|I/O error|filesystem error|EXT4-fs error|XFS.*error|overlay.*error|apparmor.*denied|runc|containerd|docker|veth|bridge' |
        tail -800

    section "22. RELEVANT PACKAGE CHANGE HISTORY"
    for HISTORY_FILE in /var/log/apt/history.log /var/log/apt/history.log.[0-9]*; do
        [ -r "$HISTORY_FILE" ] || continue
        printf '\n---------------- %s ----------------\n' "$HISTORY_FILE"
        grep -Ei 'Start-Date|End-Date|Commandline|docker|containerd|runc|nginx|apache|caddy|iptables|nftables|linux-image' \
            "$HISTORY_FILE" 2>&1 |
            tail -300
    done

    for HISTORY_FILE in /var/log/apt/history.log.*.gz; do
        [ -r "$HISTORY_FILE" ] || continue
        printf '\n---------------- %s ----------------\n' "$HISTORY_FILE"
        zgrep -Ei 'Start-Date|End-Date|Commandline|docker|containerd|runc|nginx|apache|caddy|iptables|nftables|linux-image' \
            "$HISTORY_FILE" 2>&1 |
            tail -200
    done

    section "23. FIREWALL AND DOCKER INGRESS RULES"
    if command_exists iptables; then
        printf 'iptables backend:\n'
        iptables --version 2>&1
        printf '\nDOCKER-INGRESS NAT chain:\n'
        iptables -t nat -S DOCKER-INGRESS 2>&1
        printf '\nRules referring to CapRover ports:\n'
        iptables-save 2>&1 |
            grep -E '(^\*|^:|COMMIT|--dport (80|443|3000)( |$)|DOCKER-INGRESS)' |
            head -500
    fi

    if command_exists nft; then
        printf '\nnftables rules referring to CapRover ports or Docker:\n'
        nft list ruleset 2>&1 |
            grep -Ei 'table |chain |hook |docker|dport (80|443|3000)( |$)' |
            head -500
    fi

    section "24. APPARMOR AND SECURITY CONTEXT"
    if command_exists aa-status; then
        aa-status 2>&1 | head -200
    else
        printf '%s\n' "aa-status command unavailable."
    fi

    if command_exists getenforce; then
        getenforce 2>&1
    fi

    section "25. TRANSIENT CONTAINER RUNTIME TESTS"
    printf '%s\n' "These use existing local images only and remove test containers afterward."

    printf '\nhello-world:\n'
    if docker image inspect hello-world >/dev/null 2>&1; then
        timeout 30s docker run --rm --pull=never hello-world 2>&1
    else
        printf '%s\n' "hello-world image is absent, so test skipped."
    fi

    printf '\nnginx:1.27.2 configuration test:\n'
    if docker image inspect nginx:1.27.2 >/dev/null 2>&1; then
        timeout 30s docker run --rm --pull=never nginx:1.27.2 nginx -t 2>&1
    else
        printf '%s\n' "nginx:1.27.2 image is absent, so test skipped."
    fi

    section "26. AUTOMATED SUMMARY"
    printf 'Port listeners:\n%s\n' "$PORT_DATA"

    printf '\n'
    if [ -d /captain/generated/static/domains ]; then
        printf '%s\n' "PASS: /captain/generated/static/domains exists."
    else
        printf '%s\n' "FAIL: /captain/generated/static/domains is missing."
    fi

    printf '\nCapRover replica summary:\n'
    docker service ls \
        --filter name=captain- \
        --format '{{.Name}}: {{.Replicas}} using {{.Image}}' \
        2>&1

    printf '\nLatest captain-nginx task:\n'
    docker service ps captain-nginx --no-trunc \
        --format '{{.CurrentState}} | {{.Error}}' 2>&1 |
        head -1

    printf '\nLatest captain-certbot task:\n'
    docker service ps captain-certbot --no-trunc \
        --format '{{.CurrentState}} | {{.Error}}' 2>&1 |
        head -1

    section "DIAGNOSTIC COMPLETE"
    printf 'Finished: %s\n' "$(timestamp)"
    printf 'Full report saved at: %s\n' "$REPORT"
    printf '\n%s\n' "The report may contain hostnames, addresses, container names, application names, domain names, process arguments, service logs, and package history. Review it before sharing publicly."
}

if ! main 2>&1 | tee "$REPORT"; then
    printf 'Failed to write the full diagnostic report: %s (it may be incomplete).\n' "$REPORT" >&2
    exit 1
fi
chmod 600 "$REPORT" || exit 1

printf '\nReport saved at: %s\n' "$REPORT"
printf 'View it with: sudo cat %s\n' "$REPORT"

exit 0
