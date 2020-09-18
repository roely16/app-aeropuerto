<template>
    <div>
        <b-container>
            <b-row>
                <b-col cols="7">
                     <b-input-group class="mt-3">
                        <template v-slot:append>
                            <b-input-group-text>
                                <font-awesome-icon icon="search" />
                            </b-input-group-text>
                        </template>
                        <b-form-input autocomplete="off" v-model="busqueda"></b-form-input>
                    </b-input-group>
                </b-col>
                <b-col cols="5" class="text-right pt-3">
                    <b-button variant="primary" @click="mostrarModal()">Agregar
                        <font-awesome-icon icon="plus"></font-awesome-icon>
                    </b-button>
                </b-col>
            </b-row>

            <b-row v-if="isAdmin" align-v="center" class="mt-3">
                <b-col cols="12" class="text-left">
                    <a style="cursor: pointer;" class="text-success" @click="generarReporte()">
                        Generar Excel 
                        <font-awesome-icon icon="file-excel"></font-awesome-icon>    
                    </a>
                </b-col>
            </b-row>

            <b-row>
                <b-col cols="12" class="pt-3">
                    <b-table responsive :filter="busqueda" :current-page="currentPage" :per-page="perPage" show-empty empty-text="No se han registrado reportes" empty-filtered-text="No se han encontrado registros que coincidan con su criterio de búsqueda" :items="reportes" :fields="fields">
                        <template v-slot:cell(action)="data">
                            <b-button variant="primary" size="sm" @click="showEdit(data.item)">
                                <font-awesome-icon icon="edit"></font-awesome-icon>
                            </b-button>
                        </template>
                    </b-table>
                </b-col>
            </b-row>

            <b-row align-v="center">
                
                <b-col cols="12" class="pt-2 text-center" v-if="rows > 0">
                    <b-pagination
                        v-model="currentPage"
                        :total-rows="rows"
                        :per-page="perPage"
                        align="center"
                    ></b-pagination>
                </b-col>
            </b-row>

            <b-modal hide-footer v-model="showModal"  scrollable :title="titleModal">

                <!-- <b-row>
                    <b-col cols="12">
                        <h5>Datos del Usuario</h5>
                    </b-col>
                    <b-col>
                        <b-card>
                            <b-row>
                                <b-col cols="4">
                                    <strong>Nombre: </strong>
                                </b-col>
                                <b-col cols="8">
                                    {{ usuario.nombre }} {{ usuario.apellido }}
                                </b-col>
                                <b-col cols="4">
                                    <strong>Etapa: </strong>
                                </b-col>
                                <b-col cols="8">
                                    {{ usuario.etapa }}
                                </b-col>
                                <b-col cols="4">
                                    <strong>Rol: </strong>
                                </b-col>
                                <b-col cols="8">
                                    {{ usuario.rol }}
                                </b-col>
                                <b-col cols="4">
                                    <strong>Turno: </strong>
                                </b-col>
                                <b-col cols="8">
                                    {{ usuario.turno }}
                                </b-col>
                            </b-row>
                        </b-card>
                    </b-col>
                </b-row> -->

                <b-row>
                    <b-col cols="12">
                        <h5 v-if="usuario.id_rol == 1 || usuario.id_rol == 3">Datos del Bus</h5>
                        <h5 v-if="usuario.id_rol == 2">Datos de la plataforma</h5>
                    </b-col>
                    <!-- <b-col cols="12">
                        <b-card>
                            <b-row v-if="usuario.id_rol == 1">
                                <b-col cols="12">
                                    <b-form-group description="Máximo 6 caracteres" label-class="font-weight-bold pt-0" label="No. de Placa">
                                        <b-input-group  prepend="C - ">
                                            <b-form-input maxlength="6" v-model="reporte.no_placa" autocomplete="off" required></b-form-input>
                                        </b-input-group>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="12">
                                    <b-form-group label-class="font-weight-bold pt-0" label="Tipo de Ruta">
                                        <b-form-select v-model="tipo_ruta" :options="tipos_ruta" text-field="nombre" value-field="id" required>
                                            <template v-slot:first>
                                                <b-form-select-option :value="null" disabled>-- Seleccione una opción --</b-form-select-option>
                                            </template>
                                        </b-form-select>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="12">
                                    <b-form-group label-class="font-weight-bold pt-0" label="Compañia de Transporte">
                                        
                                        <v-select :disabled="!tipo_ruta" :reduce="com => com.id"  v-model="reporte.id_com_transporte" :options="com_transporte" label="nombre"></v-select>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="12">
                                    <b-form-group label-class="font-weight-bold pt-0" label="No. de Bahía">
                                        <b-form-input v-model="reporte.no_bahia_desabordaje" autocomplete="off" required></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>

                            <b-row v-if="usuario.id_rol == 2">
                                <b-col cols="12">
                                    <b-form-group label-class="font-weight-bold pt-0" label="No. De Grupo">
                                        <b-form-input v-model="reporte.no_bahia_abordaje" autocomplete="off" required></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>

                            <b-row v-if="usuario.id_rol == 3">
                                <b-col cols="12">
                                    <b-form-group label-class="font-weight-bold pt-0" label="No. de Unidad de Transmetro">
                                        <b-form-input v-model="reporte.unidad_transmetro" autocomplete="off" required></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="12">
                                    <b-form-group label-class="font-weight-bold pt-0" label="Tipo">
                                        <b-form-radio v-model="reporte.tipo_transmetro" name="some-radios" value="E">Ruta Express</b-form-radio>
                                        <b-form-radio v-model="reporte.tipo_transmetro" name="some-radios" value="C">Paradas Continuas</b-form-radio>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                        </b-card>
                    </b-col> -->
                </b-row>

                <b-row>
                    
                    <b-col>
                        <h3 class="mb-4">Aspectos a Evaluar</h3>
                       
                        <b-row class="mb-3" v-for="(categoria, key) in categorias" :key="key">
                            <b-col>
                                
                                <b-alert show variant="secondary">
                                    <h5>{{ categoria.nombre }}</h5>
                                </b-alert>
                                <hr>
                                <b-row class="mb-2" v-for="(actividad, key) in categoria.actividades" :key="key">
                                    <b-col cols="12">
                                        <b-button :pressed="actividad.check" @click="actividad.check = !actividad.check" block :variant="!actividad.check ? 'outline-secondary' : 'success'">
                                            {{ actividad.nombre }}
                                        </b-button>
                                    </b-col>
                                    
                                    <b-col cols="12">
                                        <b-collapse v-model="actividad.show_detalle" class="mt-2">
                                            <b-row>
                                                <b-col cols="6">
                                                    <b-form-group label="Cantidad" label-class="font-weight-bold pt-0">
                                                        <b-form-input autocomplete="off" v-model="actividad.cantidad_reportada"></b-form-input>
                                                    </b-form-group>
                                                </b-col>
                                            </b-row>
                                        </b-collapse>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-row>

                        <b-row>
                            <b-col>
                                <b-form-group label="Observaciones" label-class="font-weight-bold pt-0">
                                    <b-form-textarea autocomplete="off" rows="3" v-model="reporte.observaciones"></b-form-textarea>
                                </b-form-group>
                            </b-col>
                        </b-row>

                        <b-row class="text-center">
                            <b-col>
                                <b-button class="mr-2" variant="secondary" @click="showModal = false">
                                    CANCELAR
                                </b-button>
                                <b-button  variant="success" @click="!editMode ? registrarReporte() : editarReporte()">
                                    GUARDAR
                                </b-button>
                            </b-col>
                        </b-row>
                                
                    </b-col>
                </b-row>

                <!-- <template v-slot:modal-footer="{cancel}">
                    
                    

                </template> -->
            </b-modal>

            

        </b-container>
    </div>
</template>

<script>
    
    import Swal from 'sweetalert2'
    

    export default {
        components: {
            
        },
        data(){
            return{
                busqueda: null,
                reportes: [],
                fields: [],
                currentPage: 1,
                perPage: 5,
                rows: null,
                showModal: false,
                titleModal: null,
                tipos: [],
                editMode: false,
                idReporte: null,
                modalExcel: false,
                zonas_region: [],
                options: {
                    format: 'DD/MM/YYYY',
                    useCurrent: false,
                    locale: 'es'
                },
                tipos_ruta: [
                    {
                        id: "L",
                        nombre: "Ruta Larga"
                    },
                    {
                        id: "C",
                        nombre: "Ruta Corta"
                    }
                ],
                tipo_ruta: null,
                reporte: {
                    registrado_por: null,
                    no_placa: null,
                    id_com_transporte: null,
                    no_bahia_desabordaje: null,
                    no_bahia_abordaje: null,
                    unidad_transmetro: null,
                    observaciones: null,
                    tipo_ruta: null
                },
                isAdmin: false,
                reporteZona: [],
                tituloReporte: [],
                processReporte: false,
                tipos_reporte: [
                    { value: 'R', text: 'Resumen' },
                    { value: 'D', text: 'Detalle' }
                ],
                opciones: [],
                categorias: [],
                usuario: {},
                com_transporte: []
            }
        },
        methods: {
            mostrarModal(){

                this.titleModal = "Crear Reporte"

                let usuario = JSON.parse(localStorage.getItem('usuario-auditoria-transporte'));

                let data = {
                    id_usuario: usuario.id
                }

                // Datos del usuario
                this.axios.post(process.env.VUE_APP_API_URL + '/obtener_datos_usuario.php', usuario)
				.then((response) => {

					this.usuario = response.data
					
                })

                this.axios.post(process.env.VUE_APP_API_URL + '/obtener_reporte.php', data)
                .then((response) => {

                    console.log(response.data);

                    this.categorias = response.data.categorias

                    this.editMode = false
                    this.showModal = true

                    this.reporte = {
                        registrado_por: null,
                        no_placa: null,
                        id_com_transporte: null,
                        no_bahia_desabordaje: null,
                        no_bahia_abordaje: null,
                        unidad_transmetro: null,
                        observaciones: null,
                    }

                    this.tipo_ruta = null
                    
                })

                // if (this.$route.params.id == 1) {

                //     this.titleModal = "Crear Reporte"

                //     this.axios.get(process.env.VUE_APP_API_URL + '/obtener_playas.php')
                //     .then((response) => {

                //         console.log(response.data)
                //         this.opciones = response.data
                        
                //     })

                // }else{

                //     this.titleModal = "Crear Reporte Durante"

                //     this.axios.get(process.env.VUE_APP_API_URL + '/obtener_estaciones.php')
                //     .then((response) => {

                //         console.log(response.data)
                //         this.opciones = response.data
                        
                //     })

                // }

                

                // let data = {
                //     tipo_reporte: this.$route.params.id
                // }

                // this.axios.post(process.env.VUE_APP_API_URL + '/obtener_actividades.php', data)
                // .then((response) => {

                //     console.log(response.data)
                //     this.tipos = response.data
                    
                // })

                // this.editMode = false
                // this.showModal = true

                // this.reporte = {
                //     tipo: null,
                //     de: null,
                //     hasta: null,
                //     zona: null,
                //     ubicacion: null,
                //     observaciones: ""
                // }

            },
            showEdit(item){

                console.log(item);

                let usuario = JSON.parse(localStorage.getItem('usuario-auditoria-transporte'));

                // Datos del usuario
                this.axios.post(process.env.VUE_APP_API_URL + '/obtener_datos_usuario.php', usuario)
				.then((response) => {

					this.usuario = response.data
					
                })

                let data = {
                    id_ruta: item.id_com_transporte
                }

                this.axios.post(process.env.VUE_APP_API_URL + '/detalle_com_transporte.php', data)
				.then((response) => {

                    this.tipo_ruta = response.data.tipo_ruta
					
                })

                this.axios.post(process.env.VUE_APP_API_URL + '/detalle_reporte.php', item)
                .then((response) => {

                    this.reporte = response.data.reporte

                    this.categorias = response.data.categorias

                    this.idReporte = response.data.id

                    this.titleModal = "Editar Reporte " + item.id
                    
                    this.showModal = true

                    this.editMode = true
                    
                })

            },
            registrarReporte(){

                let actividad_ingresadas = []


                this.categorias.forEach(categoria => {

                    categoria.actividades.forEach(actividad => {

                        // if ( actividad.check == true) {
                        
                            

                        // }

                        actividad_ingresadas.push(actividad)

                    })

                })
                    
                

                if (actividad_ingresadas.length <= 0) {
                    
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Debe reporte al menos una actividad!',
                    })

                }else{
                    
                    // let reporte = {
                    //     registrado_por: this.usuario.id,
                    //     ubicacion: this.reporte.ubicacion,
                    //     tipo: this.$route.params.id,
                    //     observaciones: this.reporte.observaciones
                    // }
                    
                    // // Datos Usuario
                    // reporte.actividades = actividad_ingresadas

                    this.reporte.registrado_por = this.usuario.id
                    this.reporte.actividades = actividad_ingresadas

                    this.axios.post(process.env.VUE_APP_API_URL + '/registrar_reporte.php', this.reporte)
                    // eslint-disable-next-line no-unused-vars
                    .then((response) => {

                        Swal.fire(
                            'Excelente!',
                            'El reporte ha sigo registrado exitosamente!',
                            'success'
                        ).then(() => {

                            this.showModal = false
                            this.obtener_reportes()
                            
                        })

                        console.log(response.data)
                        
                    })

                }

            },
            obtener_reportes(){

                let usuario = JSON.parse(localStorage.getItem('usuario-auditoria-transporte'));

                let data = {
                    id: usuario.id,
                    tipo: this.$route.params.id
                }

                 this.axios.post(process.env.VUE_APP_API_URL + '/obtener_reportes.php', data)
                .then((response) => {

                    this.reportes = response.data.items
                    this.fields = response.data.fields
                    this.rows = this.reportes.length
                    this.isAdmin = response.data.admin
                    
                })
                
            },
            editarReporte(){

                let actividad_ingresadas = []

                this.categorias.forEach(categoria => {

                    categoria.actividades.forEach(actividad => {

                        // if ( actividad.check == true) {
                        
                            

                        // }

                        actividad_ingresadas.push(actividad)

                    })

                })                

                if (actividad_ingresadas.length <= 0) {
                    
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Debe reporte al menos una actividad!',
                    })

                }else{

                    this.reporte.actividades = actividad_ingresadas

                    this.axios.post(process.env.VUE_APP_API_URL + '/actualizar_reporte.php', this.reporte)
                    // eslint-disable-next-line no-unused-vars
                    .then((response) => {
                        
                        Swal.fire(
                            'Excelente!',
                            'El reporte ha sigo actualizado exitosamente!',
                            'success'
                        ).then(() => {

                            this.showModal = false
                            this.obtener_reportes()
                            
                        })
                        
                    })

                }

            },
            generarReporte(){

                this.reporte = {
                    tipo: null,
                    de: null,
                    hasta: null,
                    zona: null
                }

                this.reporteZona = []
                
                let usuario = JSON.parse(localStorage.getItem('usuario-auditoria-transporte'))

                this.axios.post(process.env.VUE_APP_API_URL + '/procesar_excel.php', usuario)
                // eslint-disable-next-line no-unused-vars
                .then((response) => {

                    this.zonas_region = response.data
                    this.modalExcel = true

                })
            },
            procesarReporte(){

                this.reporteZona = []
                this.processReporte = true

                this.axios.post(process.env.VUE_APP_API_URL + '/generar_reporte.php', this.reporte)
                // eslint-disable-next-line no-unused-vars
                .then((response) => {

                    this.reporteZona = response.data
                    this.tituloReporte[0] = 'Reporte de Zona ' + this.reporte.zona
                    this.tituloReporte[1] = 'De ' + this.reporte.de + ' Hasta ' + this.reporte.hasta
                    this.tituloReporte[2] = ''
                    this.processReporte = false

                })

            }
        },
        watch: {

            // eslint-disable-next-line no-unused-vars
            '$route.params.id': function (id) {
                this.obtener_reportes()
            },
            tipo_ruta: function(val){
            
                if (val) {
                    
                    let usuario = JSON.parse(localStorage.getItem('usuario-auditoria-transporte'))

                    let data = {
                        tipo_ruta: this.tipo_ruta,
                        id_usuario: usuario.id
                    }

                    // Compañias de transporte
                    this.axios.post(process.env.VUE_APP_API_URL + '/obtener_com_transporte.php', data)
                    .then((response) => {

                        this.com_transporte = response.data
                        
                    })

                }
                
            },
            'reporte.no_placa': function(val){
                
                if (val) {
                    this.reporte.no_placa = val.toUpperCase()
                }
                

            }

        },
        mounted(){

            this.obtener_reportes()

        }
    }
</script>