<script>
    import OneDay from "./OneDay.svelte";
    import OneWeek from "./OneWeek.svelte";
    import OneMonth from "./OneMonth.svelte";
    import { fetchLastPing } from "$lib/ts/api";
    import { onMount } from "svelte";

    let lastPing = 0;
    let color = "bg-yellow-500";
    

    onMount(() => {
        setInterval(async () => {
            const fetchedPing = await fetchLastPing();
            const now = Math.floor(Date.now() / 1000);
            lastPing = fetchedPing.timestamp;
            color = now - lastPing <= 60 ? "bg-green-500" : "bg-red-500";
        }, 10000);
    });



</script>

<div class="animate-pulse p-4 {color} absolute rounded-full left-5 top-10 -z-10">

</div>

<div class="mx-4 sm:mx-10 my-10 border border-white/5 py-3 px-4 sm:px-8 bg-gray-800/30 rounded-2xl overflow-hidden relative">

<OneDay/>
<OneWeek/>
<OneMonth/>

</div>
