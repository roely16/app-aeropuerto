<template>
    <div >
        <b-container fluid>
            <b-row align-h="center" align-v="center" style="height: 30vh">
                <b-col cols="6" lg="2" md="3" class="text-center">
                    <b-img center width="100" src="./img/logo_das.jpeg" fluid alt="Responsive image"></b-img>
                </b-col>

                <b-col cols="6" lg="2" md="3" class="text-center">
                    <b-img center width="150" src="./img/logo.jpg" fluid alt="Responsive image"></b-img>
                </b-col>
            </b-row>

            <b-row style="height: 70vh; background-color: #0c3757">
				<b-col cols="12">

                    
                    <b-form @submit.prevent="login">

                        <h5 class="text-center text-white mt-4">MINISTERIO DE SALUD PÚBLICA Y ASISTENCIA SOCIAL</h5>
                        <b-row class="pt-4 text-center" align-v="center">

                            <b-col cols="12" sm="12" md="4" offset-md="4">
                                <b-form-group style="color: white" label="Usuario" label-size="lg">
                                    <b-form-input type="text" style="text-align:center;" v-model="usuario.usuario" autocomplete="off" size="lg" required></b-form-input>
                                </b-form-group>
                            </b-col>

                            <b-col cols="12" v-if="loginError">
                                
                                <h4 style="color: yellow">Usuario Inválido !!</h4>
                            </b-col>

                            <b-col cols="12" class="text-center pt-4">
                                <b-button variant="success" type="submit" size="lg">ACEPTAR</b-button>
                            </b-col>

                        </b-row>
                    </b-form>

                    <b-row class="text-center" style="background-color: #0c3757" align-v="end">
                        <b-col cols="12">
                            
                        </b-col>
                        <b-col cols="12" class="pt-4 text-white text-center">
                            <!-- <b-img width="200" src="./img/juntoslogramosmas.png" fluid alt="Responsive image"></b-img> -->
                            <br>
                            ¿No tiene cuenta? 
                            <b-button :to="{name: 'registro'}" variant="link"><h4 style="color: yellow">Registrarse</h4></b-button>
                        </b-col>
                    </b-row>

				</b-col>
            </b-row>
            

           

        </b-container>
    </div>
</template>


<script>

    import Swal from 'sweetalert2'

    export default {
        data(){
            return{
                usuario: {},
                loginError: false
            }
        },
        methods: {
            login(){

                this.loginError = false

                this.axios.post(process.env.VUE_APP_API_URL + '/login.php', this.usuario)
				.then((response) => {

                    if (!response.data) {
						
						this.loginError = true

                    }else{

						// Si el usuario es correcto validar si ya esta activa la cuenta

						let data = {
							id: response.data.id
						}

						this.axios.post(process.env.VUE_APP_API_URL + '/cuenta_verificada.php', data)
						.then((response) => {

							this.credentials = response.data

							if (response.data.verificada) {

								localStorage.setItem('usuario-auditoria-transporte', JSON.stringify(this.credentials))

								this.$router.push({ name: 'menu' })

							}else{

								Swal.fire({
									title: 'Activación de cuenta',
									text: "Su cuenta aún no ha sido activada, ¿desea reenviar el correo para activación?",
									icon: 'warning',
									showCancelButton: true,
									confirmButtonColor: '#3085d6',
									cancelButtonColor: '#d33',
									confirmButtonText: 'Si, reenviar!',
									cancelButtonText: 'Cancelar',
									showLoaderOnConfirm: true,
									preConfirm: () => {

										let usuario = {
											id: response.data.id
										}
										return this.axios.post(process.env.VUE_APP_API_URL + '/reenviar_correo.php', usuario)
										// eslint-disable-next-line no-unused-vars
										.then((response) => {

											Swal.fire(
												'Excelente!',
												'<p>Se ha enviado un correo electrónico a la dirección registrada, por favor revise su buzón y siga las instrucciones indicadas para activar su cuenta.</p>',
												'success'
											)

										})
									},
									allowOutsideClick: () => !Swal.isLoading()
								})
								
							}

						})

                    }

                })

            }
        }        
    }
</script>