<template>
    <div >
        <b-container fluid>
            <b-form @submit.prevent="registrarse()">
                <b-row align-h="center">
                    <b-col lg="6" sm="12" md="8">
                        <b-row class="pt-4 pb-4">
                    <b-col class="mb-4" cols="12">
                        <b-row class="text-center">
                            <b-col cols="1">
                                <h4  @click="back()">
                                    <font-awesome-icon icon="arrow-left" />
                                </h4>
                            </b-col>
                            <b-col>
                                <h4 >Registro</h4>
                            </b-col>
                        </b-row>
                    </b-col>
                     <b-col cols="12" sm="12" md="6">
                        <b-form-group label-class="font-weight-bold pt-0" label="Nombres">
                            <b-form-input v-model="usuario.nombre" autocomplete="off" required></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" sm="12" md="6">
                        <b-form-group label-class="font-weight-bold pt-0" label="Apellidos">
                            <b-form-input v-model="usuario.apellido" autocomplete="off" required></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" sm="12" md="6">
                        <b-form-group label-class="font-weight-bold pt-0" label="Teléfono">
                            <b-form-input type="number" v-model="usuario.telefono" autocomplete="off" required></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" sm="12" md="6">
                        <b-form-group label-class="font-weight-bold pt-0" label="Correo Electronico">
                            <b-form-input type="email" v-model="usuario.email" autocomplete="off" required></b-form-input>
                        </b-form-group>
                    </b-col>
                    
                    <b-col cols="12" sm="12" md="6">
                        <b-form-group label-class="font-weight-bold pt-0" label="Área">
                            <b-form-select v-model="usuario.id_area" :options="areas" text-field="nombre" value-field="id" required>
                                <template v-slot:first>
                                    <b-form-select-option :value="null" disabled>-- Seleccione una opción --</b-form-select-option>
                                </template>
                            </b-form-select>
                        </b-form-group>
                    </b-col> 

                    <b-col cols="12" class="mt-4 text-center">
                        <b-button :disabled="isSending" type="submit" variant="success" size="lg">{{ isSending ? 'Registrando..' : 'Registrarse' }} 
                            <font-awesome-icon icon="sign-in-alt" />
                        </b-button>
                    </b-col>
                </b-row>
                    </b-col>
                </b-row>
                
            </b-form>
        </b-container>
    </div>
</template>

<script>

    import Swal from 'sweetalert2'

    export default {
        data(){
            return{
                usuario: {
                    nombre: null,
                    apellido: null,
                    telefono: null,
                    email: null,
                    id_area: null
                },
                dependencias: [],
                etapas: [],
                turnos: [],
                roles: [],
                simulacros: [],
                isSending: false,
                areas: []
            }
        },
        methods: {
            registrarse(){

                if (!this.same_password) {
                    
                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        text: 'Ambas contraseñas deben de coincidir!'
                    })

                }else{

                    this.isSending = true

                    this.axios.post(process.env.VUE_APP_API_URL + '/registro.php', this.usuario)
                    .then((response) => {
                        
                        console.log(response.data)

                         if (response.data.status != 200) {
                            
                            Swal.fire({
                                icon: 'error',
                                title: 'Error...',
                                html: response.data.message
                            })

                        }else{

                            Swal.fire(
                                'Registro exitoso!',
                                response.data.message,
                                'success'
                            ).then(() => {

                                this.$router.push('/')

                            })

                        }

                        this.isSending = false
                    })
                }

            },
            back(){ 

                this.$router.push('/');

            },
            obtener_datos_registro(){

                this.axios
                .get(process.env.VUE_APP_API_URL + '/datos_registro.php')
                .then((response) => {

                    this.areas = response.data.areas

                })

            },
            // obtener_roles(id_etapa){

            //     this.usuario.rol = null
                
            //     let data = {
            //         id_etapa: id_etapa
            //     }

            //     this.axios
            //     .post(process.env.VUE_APP_API_URL + '/obtener_roles.php', data)
            //     .then((response) => {

            //         this.roles = response.data

            //     })

            // },
            // obtener_turnos(id_simulacro){

            //     let data = {
            //         id_simulacro: id_simulacro
            //     }

            //     this.axios
            //     .post(process.env.VUE_APP_API_URL + '/obtener_turnos.php', data)
            //     .then((response) => {

            //         console.log(response.data);

            //         this.turnos = response.data

            //     })                

            // }
        },
        computed: {

            same_password: function(){

                if (this.usuario.password == this.usuario.re_password) {
                    
                    return true
                }

                return false

            }

        },
        watch: {

            // 'usuario.etapa'(val){

            //     this.obtener_roles(val)

            // },
            // 'usuario.id_simulacro'(val){

            //     if (val) {
            //         this.obtener_turnos(val)
            //     }

            // }

        },
        mounted(){

            this.obtener_datos_registro()

        }
    }
</script>