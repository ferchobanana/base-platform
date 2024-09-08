<script lang="ts">
    import { enhance } from "$app/forms"
    import type { ActionData } from "./$types"
    import LoadingPage from "$lib/components/LoadingPage.svelte";

    export let form: ActionData

    let loading = false

    $: if(form?.message) {
        loading = false
    }
</script>

<div class="signup">

    {#if loading}
        <LoadingPage></LoadingPage>
    {/if}
        
    <form method="post" class="signup-form" use:enhance on:submit={() => { loading = true }}>
        <h1>Crea una cuenta</h1>
        <label for="email">Correo electrónico</label>
        <input type="email" id="email" name="email">

        <label for="password">Contraseña</label>
        <input type="password" id="password" name="password">

        <button>Crear cuenta</button>
        <p class="form-message">{form?.message ?? ""}</p>
    </form>

</div>

<style>
    .signup {
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: rgba(243, 244, 246, 1);
    }

    /* Formulario */
    .signup-form {
        width: 400px;
        display: flex;
        flex-direction: column;
        color: #fff;
        background-color: var(--background-dark-color);
        border-radius: 15px;
        padding: 60px 40px;
    }

    h1 {
        font-size: 30px;
        text-align: center;
        margin-bottom: 20px;
    }
    label {
        margin-bottom: 5px;
        color: #8f9cb7;
    }
    input {
        padding: 15px;
        background: none;
        color: #fff;
        border: 1px solid #65718c;
        border-radius: 5px;
        margin-bottom: 10px;
    }

    input:focus {
        outline: 1px solid var(--primary-color);
    }

    button {
        margin-top: 25px;
        padding: 15px 20px;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
        background-color: var(--primary-color);
        border: none;
        border-radius: 6px;
        cursor: pointer;
    }
    .form-message {
        text-align: center;
        margin-top: 15px;
    }

</style>