<script>
    import { onMount } from "svelte";

    const END_TIME = Math.floor(Date.now() / 1000);
    const START_TIME = END_TIME - 24 * 60 * 60;

    const downtimes = [
        { timestamp: END_TIME - 3 * 60 * 60, duration: 10 * 60 },
        { timestamp: END_TIME - 1 * 60 * 60, duration: 10 * 60 },
        { timestamp: END_TIME - 16 * 60 * 60, duration: 10 * 60 },
        { timestamp: END_TIME - 13 * 60 * 60, duration: 10 * 60 },
        { timestamp: END_TIME - 15 * 60 * 60, duration: 10 * 60 },
        { timestamp: END_TIME - 17 * 60 * 60, duration: 10 * 60 },
        { timestamp: END_TIME - 23 * 60 * 60, duration: 10 * 60 },
        { timestamp: END_TIME - 6 * 60 * 60, duration: 30 * 60 }
    ];

    function formatIST(unix) {
        return new Date(unix * 1000).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour12: true
        });
    }

    const bar_details = [];

    for (let i = START_TIME; i <= END_TIME; i += 60 * 60) {
        const hourStart = i;
        const hourEnd = i + 60 * 60;

        const overlaps = downtimes.filter(down => {
            const downStart = down.timestamp;
            const downEnd = down.timestamp + down.duration;
            return downStart < hourEnd && downEnd > hourStart;
        });

        if (overlaps.length > 0) {
            bar_details.push({
                status: "down",
                downtimes: overlaps,
                hourStart
            });
        } else {
            bar_details.push({
                status: "up",
                hourStart
            });
        }
    }

    let tooltipContent = "";
    let tooltipX = 0;
    let tooltipY = 0;
    let showTooltip = false;

    function handleMouseEnter(e, data) {
        const rect = e.target.getBoundingClientRect();
        tooltipX = rect.left + rect.width / 2;
        tooltipY = rect.top - 10;

        if (data.status === "down") {
            tooltipContent = `
                <div><strong>${formatIST(data.hourStart)}</strong></div>
                ${data.downtimes.map(d => `↓ ${formatIST(d.timestamp)} for ${Math.floor(d.duration / 60)} min`).join("<br>")}
            `;
        } else {
            tooltipContent = `<div><strong>${formatIST(data.hourStart)}</strong>`;
        }

        showTooltip = true;
    }

    function handleMouseLeave() {
        showTooltip = false;
    }
</script>


<div class="mx-4 sm:mx-10 mt-10 border border-white/5 py-3 px-4 sm:px-8 bg-gray-800/30 h-[80vh] rounded-2xl overflow-hidden relative">
    <div class="mt-10 flex gap-1 sm:gap-2 px-1 sm:px-6 h-[12vh]">
        {#each bar_details as data, i}
            <div
                class="{data.status === 'down' ? 'bg-red-500' : 'bg-green-500'} flex-1 rounded-lg relative"
                style="min-width: 0"
                onmouseenter={(e) => handleMouseEnter(e, data)}
                onmouseleave={handleMouseLeave}
                tabindex="{i}"
            ></div>
        {/each}
    </div>

    <p class="mx-4 text-sm mt-2 text-gray-300">24h</p>


    {#if showTooltip}
        <div
            class="fixed z-50 bg-black text-white text-sm px-3 py-2 rounded-md shadow-lg max-w-full whitespace-nowrap pointer-events-none"
            style="top: {tooltipY}px; left: {tooltipX}px; transform: translate(-50%, -100%)"
        >
            {@html tooltipContent}
        </div>
    {/if}

</div>
