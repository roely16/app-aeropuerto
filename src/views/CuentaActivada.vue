<template>
    <div>
        <b-overlay :show="checking" rounded="sm">
            <b-container style="background-image: url('./img/fondoLogin.png'); background-size:cover" fluid>
                
                <b-row style="height: 35vh" align-v="center">
                    <b-col cols="12" class="text-center">
                        <!-- <b-img width="200" src="./img/logo_muni_circulo.png" fluid alt="Responsive image"></b-img> -->
                    </b-col>
                </b-row>

                <b-row style="height: 65vh">
                    <b-col v-if="message" cols="12" class="pt-4 text-center">
                        <div v-html="message"></div>
                        <b-button :to="{name: 'login'}" size="lg" class="mt-3" variant="success">Iniciar Sesión</b-button>
                    </b-col>
                </b-row>
                
            </b-container>
        </b-overlay>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                checking: false,
                activada: true,
                message: null
            }
        },
        methods: {
            activar_cuenta(){

                this.checking = true

                let usuario = {
                    id: this.$route.params.id
                }

                this.axios.post(process.env.VUE_APP_API_URL + '/activar_cuenta.php', usuario)
                .then((response) => {

                    this.message = response.data
                    this.checking = false

                })

            }
        },
        mounted(){

            this.activar_cuenta()
            
        }
    }
</script>