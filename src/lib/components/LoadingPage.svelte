<script>
    import Icon from '@iconify/svelte';
</script>

<div class="spinner-container">
    
    <Icon icon="fa6-solid:spinner" class="loading-spinner" color="#fff" width="50px" />

</div>

<style>

    .spinner-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        display: grid;
        place-items: center;
        background-color: rgba(0, 0, 0, 0.5);
    }

    @keyframes loading {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg)
        }
    }

    :global(.loading-spinner) {
        animation: loading 1s linear infinite;
    }

</style>