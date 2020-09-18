<template>
	<div class="home">
		<b-navbar sticky style="background-color: #0c3757" toggleable="lg" type="dark">
			<b-navbar-brand href="#">
				<b-row align-v="center">
					<b-col cols="2">
						<font-awesome-icon icon="user" />
					</b-col>
					<b-col cols="9">
						<h6 class="mb-0">{{ userName }}</h6>
						<!-- <h6 v-if="usuario" class="font-weight-lighter p-0">{{ usuario.dependencia.toUpperCase() }}</h6> -->
						<h6 v-if="usuario" class="mb-0" style="color: #f2e006">{{ this.usuario.area }}</h6>
					</b-col>
				</b-row>
			</b-navbar-brand>
			<b-navbar-nav class="ml-auto">
				<b-nav-item @click="show = !show">
					<font-awesome-icon size="lg" icon="bars" />
				</b-nav-item>
			</b-navbar-nav>
		</b-navbar>

		<b-sidebar
			id="sidebar-backdrop"
			backdrop
			shadow
			v-model="show"
		>
			<div class="px-3 py-2">
				<b-row>
					<b-col>
						<span class="font-weight-lighter">Versión {{ version }}</span>
					</b-col>
				</b-row>
				<b-row align-h="center">
					<b-col cols="4">
						<b-img src="./img/user.png" fluid alt="Responsive image"></b-img>
					</b-col>
					<b-col class="text-center mt-3" cols="12">
						<h5>{{ userName }}</h5>
						<!-- <b-link @click="modalCuenta = true">Configuración</b-link> -->
					</b-col>
				</b-row>
			</div>

			<nav class="mb-3 mt-4">
				<b-nav vertical>
					<b-nav-item v-for="(option, key) in menu" :key="key" :to="{name: option.url, params: {id: option.tipo_reporte}, meta: {label: option.name}}" >{{ option.nombre }}</b-nav-item>
					<b-nav-item @click="salir"><span class="text-danger">Salir</span></b-nav-item>
				</b-nav>
			</nav>
		</b-sidebar>

		<b-modal v-model="modalCuenta" title="Mi Cuenta" hide-footer>
			<b-row>
				<b-col>
					<b-card no-body>
						<b-tabs card>
							<b-tab title="Cambiar Contraseña" active>
								
								<b-form @submit.prevent="actualizarClave()">
									<b-form-group label-class="font-weight-bold pt-0" label="Contraseña Actual">
										<b-input-group>
											<template v-slot:append>
												<b-input-group-text @click="pass.show_pass = !pass.show_pass">
													<font-awesome-icon :icon="pass.show_pass ? 'eye-slash' : 'eye'" />
												</b-input-group-text>
											</template>
											<b-form-input :type="pass.show_pass ? 'text' : 'password'" v-model="pass.actual" autocomplete="off" required></b-form-input>
										</b-input-group>
									</b-form-group>

									<b-form-group label-class="font-weight-bold pt-0" label="Nueva Contraseña">
										<b-input-group>
											<template v-slot:append>
												<b-input-group-text @click="pass.show_nuevo_pass = !pass.show_nuevo_pass">
													<font-awesome-icon :icon="pass.show_nuevo_pass ? 'eye-slash' : 'eye'" />
												</b-input-group-text>
											</template>
											<b-form-input autocomplete="off" :type="pass.show_nuevo_pass ? 'text' : 'password'" v-model="pass.nueva" required></b-form-input>
										</b-input-group>
									</b-form-group>

									<b-form-group label-class="font-weight-bold pt-0" label="Repite Nueva Contraseña">
										<b-input-group>
											<template v-slot:append>
												<b-input-group-text @click="pass.show_repite_nuevo_pass = !pass.show_repite_nuevo_pass">
													<font-awesome-icon :icon="pass.show_repite_nuevo_pass ? 'eye-slash' : 'eye'" />
												</b-input-group-text>
											</template>
											<b-form-input autocomplete="off" :type="pass.show_repite_nuevo_pass ? 'text' : 'password'" v-model="pass.repite_nueva" required></b-form-input>
										</b-input-group>
									</b-form-group>

									<b-row class="text-center">
										<b-col>
											<b-button size="lg" type="submit" variant="success">
												Actualizar
												<font-awesome-icon icon="sync"></font-awesome-icon>
											</b-button>
										</b-col>
									</b-row>
								</b-form>

							</b-tab>
							
						</b-tabs>
					</b-card>
				</b-col>
			</b-row>
		</b-modal>

		<router-view />

	</div>
</template>

<script>
// @ is an alias to /src

	import Swal from 'sweetalert2'

	export default {
		name: 'Home',
		data(){
			return{
				menu: [],
				usuario: null,
				show: false,
				modalCuenta: false,
				pass: {
					actual: null,
					nueva: null,
					repite_nueva: null,
					show_pass: false,
					show_nuevo_pass: false,
					show_repite_nuevo_pass: false
				}
			}
		},
		methods: {
			actualizarClave(){

				if (!this.pass_coinciden) {
					
					Swal.fire({
						icon: 'error',
						title: 'Oops...',
						text: 'La nueva contraseña debe coincidir!',
					})

				}else{

					// Actualizar clave
					let usuario = JSON.parse(localStorage.getItem('usuario-auditoria-transporte'))

					let data = {
						id_usuario: usuario.id,
						pass: this.pass.actual,
						nuevo_pass: this.pass.nueva
					}

					this.axios.post(process.env.VUE_APP_API_URL + '/actualizar_clave.php', data)
					.then((response) => {

						if (response.data.code != 200) {
							
							Swal.fire({
								icon: 'error',
								title: 'Oops...',
								text: response.data.message,
							})

						}else{

							Swal.fire(
								'Excelente!',
								response.data.message,
								'success'
							).then(() => {

								localStorage.removeItem('usuario-auditoria-transporte')

								this.$router.push({ name: 'login' })

							})

						}
						
						
					})

				}

				console.log('actualizar')

			},
			obtener_menu(){

				let usuario = JSON.parse(localStorage.getItem('usuario-auditoria-transporte'))

				this.axios.post(process.env.VUE_APP_API_URL + '/obtener_menu.php', usuario)
				.then((response) => {

					this.menu = response.data
					
				})

				// Datos Usuario
				this.axios.post(process.env.VUE_APP_API_URL + '/obtener_datos_usuario.php', usuario)
				.then((response) => {

					this.usuario = response.data
					
				})

			},
			salir(){

				let usuario = JSON.parse(localStorage.getItem('usuario-auditoria-transporte'))
				
				this.axios.post(process.env.VUE_APP_API_URL + '/salir.php', usuario)
				.then((response) => {

					if (response.data) {
						
						localStorage.removeItem('usuario-monitoreo-fase2')

						this.$router.push({ name: 'login' })

					}

				})

			},
			datos_usuario(){



			}
		},
		computed: {

			userName: function(){

				let usuario = JSON.parse(localStorage.getItem('usuario-auditoria-transporte'))
				
				return usuario.nombre.toUpperCase() + ' ' + usuario.apellido.toUpperCase();

			},
			version: function(){

				return process.env.VUE_APP_VERSION

			},
			pass_coinciden: function(){
				
				if (this.pass.nueva != this.pass.repite_nueva) {
					
					return false

				}

				return true

			}

				
		},
		mounted(){

			this.obtener_menu()

		}
	}
</script>
