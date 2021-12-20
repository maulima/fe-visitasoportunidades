import React, {Component} from 'react'
import {View, ScrollView, Image, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import _ from 'lodash'
import testID from '../../custom_node_modules/react-native-testid'

import {BACKGROUND_COLOR, BLACK, BROWN_GREY, GREEN, RED, WHITE} from '../styles/Colors'
import {TipoBusqueda} from '../constants/Data'
import {getColaboradoresLength, getEmpresasLength} from '../store/selectors'
import {
    crearProspecto,
    limpiarEmpresas,
    obtenerEmpresas,
    validarEmpresasEspecialista,
    obtenerProspectos
} from '../store/actions/empresas'
import {obtenerColaboradoresBusqueda} from '../store/actions/colaboradores'
import {limpiarEmpresasGrupoEconomico, obtenerEmpresaGrupoEconomico} from '../store/actions/gruposEconomicos'
import {formatoRut, desformatoRut} from '../utils/StringHelper'
import NavBar from './NavBar'
import InputGroup from './InputGroup'
import SearchCard from './SearchCard'
import EmptyButton from './EmptyButton'
import Loading from './Loading'
import CrearProspectoModal from './CrearProspectoModal'
import GoBackButton from './GoBackButton'

const mapStateToProps = (state) => {
    const {RUT_CLIENTE, GRUPO_ECONOMICO} = TipoBusqueda
    const {env: {API_ENV}} = process

    return {
        currentUser: API_ENV === 'dev' ? state.currentUser.profile : state.auth.profile,
        isFetchingGE: state.gruposEconomicos.isFetching,
        isFetchingEmpresas: state.empresas.isFetching,
        isFetchingColaboradores: state.colaboradores.isFetchingBusqueda,
        isValidatingEmpresa: state.empresas.isValidating,
        gruposEconomicos: state.gruposEconomicos.lista,
        empresasGE: state.gruposEconomicos.empresas,
        empresas: state.empresas.lista,
        cartera: state.empresas.cartera,
        itemLength: (RUT_CLIENTE || GRUPO_ECONOMICO) ? getEmpresasLength(state) : getColaboradoresLength(state),
        colaboradores: state.colaboradores.lista,
        colaboradoresBusqueda: state.colaboradores.listaBusqueda,
        errorEmpresa: state.empresas.hasError,
        errorColaboradores: state.colaboradores.hasError,
        isPushingProspecto: state.empresas.isPushing,
        errorProspecto: state.empresas.hasErrorProspecto
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            obtenerColaboradoresBusqueda,
            obtenerEmpresas,
            validarEmpresasEspecialista,
            obtenerProspectos,
            obtenerEmpresaGrupoEconomico,
            limpiarEmpresasGrupoEconomico,
            limpiarEmpresas,
            crearProspecto
        }, dispatch)
    }
}

type Props = {
    title?: String,
    headerLeft?: React.Element<*>,
    type?: String,
    getValue: func
}

class SearchModal extends Component<Props> {

    state = {
        groupList: {},
        list: {},
        searchActive: false,
        searchValue: '',
        selectItem: null,
        loading: false,
        error: false,
        itemLength: 0,
        prospectoModalVisible: false,
        nuevaEmpresa: {},
        empresasGE: {
            rutList: [],
            rutPos: null
        },
        selectGroupItem: null
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        const {
            type,
            isFetchingGE,
            isFetchingEmpresas,
            isFetchingColaboradores,
            empresasGE,
            empresas,
            itemLength,
            isPushingProspecto,
            isValidatingEmpresa,
            actions: {obtenerEmpresas, obtenerProspectos, limpiarEmpresas},
            currentUser: {rol}
        } = this.props
        

        const {searchValue} = this.state

        const {GRUPO_ECONOMICO, RUT_CLIENTE, RESPONSABLE} = TipoBusqueda

        if (isFetchingColaboradores && !nextProps.isFetchingColaboradores) {
            if (nextProps.errorColaboradores) {
            } else {
                this.setState({
                    loading: false,
                    list: nextProps.colaboradoresBusqueda
                })

            }
        }

        if (!isFetchingGE && nextProps.isFetchingGE || !isFetchingColaboradores && nextProps.isFetchingColaboradores) {
            this.setState({loading: true})
        }

        if (isValidatingEmpresa && !nextProps.isValidatingEmpresa &&
            rol === 'Especialista' &&
            type === GRUPO_ECONOMICO
        ) {
            const {empresasGE} = this.state
            obtenerEmpresas(empresasGE.rutList[empresasGE.rutPos]).then(() => {
            }).catch(e => {
                console.log(e)
            })
        } else if (isValidatingEmpresa && !nextProps.isValidatingEmpresa) {
            const rut = desformatoRut(searchValue)
            limpiarEmpresas(rut)
            if (nextProps.errorEmpresa) {
                console.log(`no tienes el rut ${searchValue} en tu cartera electrónica`)
                obtenerProspectos(rut)
            } else {
                obtenerEmpresas(rut).then(() => {
                }).catch(e => {
                    console.log(e)
                })
            }
        }

        if (isFetchingEmpresas && !nextProps.isFetchingEmpresas &&
            rol === 'Especialista' &&
            type === GRUPO_ECONOMICO
        ) {

            const {rutPos, rutList} = this.state.empresasGE
            const pos = rutPos === null ? 0 : rutPos + 1

            this.setState({
                empresasGE: {
                    rutList: [...rutList],
                    rutPos: pos,
                }
            })
            if (rutList.length > pos) {
                this.fetchValidateEmpresasGE(nextProps.empresasGE[pos], pos)
            } else {
                this.setState({loading: false})
            }


        } else if (isFetchingEmpresas && !nextProps.isFetchingEmpresas) {
            if (type === GRUPO_ECONOMICO) {
                this.setState({loading: false})
            } else if (nextProps.errorEmpresa) {
                obtenerProspectos(desformatoRut(this.state.searchValue))
            } else {
                if (nextProps.errorProspecto) {
                    console.log(`no prospectos encontrados por el rut ${this.state.searchValue}`)

                    this.setState({loading: false, list: {}})
                } else {
                    this.setState({loading: false})
                }
            }
        }else if(type === RUT_CLIENTE){
            this.setState({list:{}})
        }

        //devuelve lista de rut
        //Si es banquero llamamos al servicio obtenerEmpresas (fetchEmpresasGrupoEconomico),
        // pero si especialista, lo agregamos a la cartera y despyes llamamos al servicio obtenerEmpresas
        if (Object.keys(empresasGE || {}).length !== Object.keys(nextProps.empresasGE || {}).length && Object.keys(nextProps.empresasGE || {}).length > 0) {
            const {currentUser: {rol}} = this.props
            if (rol === 'Banquero') {
                this.fetchEmpresasGrupoEconomico(nextProps.empresasGE)
            } else {
                const pos = this.state.empresasGE.rutPos === null ? 0 : this.state.empresasGE.rutPos + 1
                this.setState({
                    empresasGE: {
                        rutList: [...nextProps.empresasGE],
                        rutPos: pos,
                    }
                })
                this.fetchValidateEmpresasGE(nextProps.empresasGE[pos])
            }
        }

        if (Object.keys(empresas || {}).length !== Object.keys(nextProps.empresas || {}).length && Object.keys(nextProps.empresas || {}).length > 0) {
            this.getEmpresas(nextProps.empresas)
        }

        if (itemLength !== nextProps.itemLength) {
            this.setState({
                itemLength: nextProps.itemLength
            })
        }

        if (!isPushingProspecto && nextProps.isPushingProspecto) {
            this.setState({loading: true})
        }
        if (isPushingProspecto && !nextProps.isPushingProspecto) {
            this.setState({loading: false})

            if (!nextProps.errorProspecto) {
                const {nuevaEmpresa, nuevaEmpresa: {rut, digitoVerificador}} = this.state

                this.setState({
                    prospectoModalVisible: false,
                    list: {[rut + digitoVerificador]: nuevaEmpresa}
                })
            }
        }

        if (!_.isEmpty(empresas) && _.isEmpty(nextProps.empresas)) {
            this.setState({list: {}, groupList: {}, selectItem: null, selectGroupItem: null})
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {fromFilters, type} = this.props
        const {list} = this.state
        const {GRUPO_ECONOMICO} = TipoBusqueda

        if (fromFilters && type === GRUPO_ECONOMICO && _.size(list) > _.size(prevState.list)) {
            const groupList = {}

            _.map(list, (gp) => groupList[gp.nombreGrupo] ? groupList[gp.nombreGrupo].items += 1 : groupList[gp.nombreGrupo] = {items: 1})

            this.setState({groupList})
        }
    }

    filterGrupoEconomico = (value) => {
        const {actions: {obtenerEmpresaGrupoEconomico, limpiarEmpresasGrupoEconomico, limpiarEmpresas}, gruposEconomicos} = this.props

        limpiarEmpresasGrupoEconomico() //Borra todas las empresas del grupo economico
        limpiarEmpresas() //Borra todas las empresas
        this.setState({
            empresasGE: {
                rutList: [],
                rutPos: null
            }
        })
        let filtrados = _.filter((gruposEconomicos), e => {
            return e.nombreGrupo.toLowerCase().includes(value.toLowerCase())
        })

        if (!_.isEmpty(filtrados)) {
            filtrados.map((item) => {
                obtenerEmpresaGrupoEconomico(item.idGrupo, item.nombreGrupo)
            })
        } else {
            this.setState({
                error: true,
                errorMssg: 'Su búsqueda no tuvo resultados.'
            })
        }

    }

    fetchEmpresasGrupoEconomico = (empresas) => {
        const {actions: {obtenerEmpresas}} = this.props
        if (Object.keys(empresas || {}).length > 0) {
            Object.keys(empresas || {}).map(key => {
                obtenerEmpresas(empresas[key])
            })
        }
    }

    fetchValidateEmpresasGE = (key) => {
        const {actions: {validarEmpresasEspecialista}} = this.props
        validarEmpresasEspecialista(key).then(() => {
        }).catch(e => {
            console.log(e)
        })
    }

    filterEmpresas = (value) => {
        const {
            actions: {
                obtenerEmpresas,
                validarEmpresasEspecialista,
                obtenerProspectos,
                limpiarEmpresas
            }, currentUser: {rol}, cartera
        } = this.props

        this.setState({loading: true})

        if (rol === 'Banquero') {
            limpiarEmpresas(value)
            if (_.find(cartera, (rut) => rut === value)) {
                //Busca en los servicios del banco un cliente banco
                obtenerEmpresas(value).then(() => {
                }).catch(e => {
                    console.log(e)
                })
            } else {
                //Busca en los servicios visitas y tubos los prospecto
                //Clientes que fueron creados desde la App
                console.log(`no tienes el rut ${this.state.searchValue} en tu cartera electrónica`)
                obtenerProspectos(value)
            }
        } else {
            limpiarEmpresas(value)
            validarEmpresasEspecialista(value).then(() => {
            }).catch(e => {
                console.log(e)
            })
        }

    }

    getEmpresas = (list) => {
        this.setState({list})
    }

    onSaveProspecto = (value) => {
        const {actions: {crearProspecto}} = this.props
        const res = _.clone(value)

        if (res.dv) {
            res.digitoVerificador = res.dv
            delete res.dv
        }

        if (res.nombre) {
            res.nombreEmpresa = res.nombre
            delete res.nombre
        }

        this.setState({
            nuevaEmpresa: res
        })

        crearProspecto(value)
    }

    sendNuenvaEmpresa = () => {
        const {nuevaEmpresa} = this.state
        this.props.getValue(nuevaEmpresa)
    }

    filterResponsable = (value) => {
        const {actions: {obtenerColaboradoresBusqueda}} = this.props
        if (value.length < 3) {
            this.setState({
                error: true,
                errorMssg: 'Su búsqueda debe tener un mínimo de 3 caracteres '
            })
        } else {
            obtenerColaboradoresBusqueda(value)
        }

    }

    handleSearchType = (e) => {
        //Accion de busqueda del input
        const {actions: {limpiarEmpresas}, type} = this.props
        const {searchValue} = this.state
        const {GRUPO_ECONOMICO, RUT_CLIENTE, RESPONSABLE} = TipoBusqueda

        if (_.isEmpty(searchValue) || searchValue === '' || searchValue.length === 0) {
            return
        }

        if (searchValue.length < 3 && GRUPO_ECONOMICO === type) {
            this.setState({
                error: true,
                errorMssg: 'Su búsqueda debe tener un mínimo de 3 caracteres',
                itemLength: 0,
                list: {}
            })
            return
        }

        if (desformatoRut(searchValue).length < 8 && RUT_CLIENTE === type) {
            this.setState({error: true, errorMssg: 'Su búsqueda debe tener un mínimo de 8 caracteres'})
            limpiarEmpresas()
            return
        }

        this.setState({searchActive: true})

        if (type === GRUPO_ECONOMICO) {
            this.filterGrupoEconomico(searchValue)
        } else if (type === RUT_CLIENTE) {
            this.filterEmpresas(desformatoRut(searchValue))
        } else if (type === RESPONSABLE) {
            this.filterResponsable(searchValue)
        } else {
    
        }
    }

    handleSearchValue = (value) => {
        const {type} = this.props
        let newValue = value

        this.setState({
            searchValue: newValue,
            error: false
        })
    }

    handleEmptyInput = () => {
        const {actions: {limpiarEmpresas}, type} = this.props

        switch (type) {
            case TipoBusqueda.RESPONSABLE:
                this.setState({list: {}})
                break
            case TipoBusqueda.RUT_CLIENTE:
            case TipoBusqueda.GRUPO_ECONOMICO:
                limpiarEmpresas()
                break
            default:
        }

        this.setState({searchValue: '', searchActive: false, error: false})
    }

    handleSelectItem = (value) => {
        this.setState({
            selectItem: value,
            selectGroupItem: null,
            error: false
        })
    }

    handleSelectGroup = (value) => {
        const {selectGroupItem} = this.state
        // const {empresas} = this.props
        // let resultadoEmpresas = Object.keys(empresas).find((empresa) => {
        //     return value.name === empresas[empresa].nombreGrupo
        // })

        this.setState({
            selectGroupItem: _.isEqual(value, selectGroupItem) ? null : value,
            selectItem: null
        })
    }

    handleSubmitItem = () => {
        const {selectItem, selectGroupItem} = this.state
        const {getValue, type, fromFilters} = this.props
        const {RUT_CLIENTE, GRUPO_ECONOMICO} = TipoBusqueda
        if (selectItem !== null || selectGroupItem !== null) {
            if (selectItem === null && selectGroupItem === null) {
                this.setState({
                    error: true,
                    errorMssg: 'Debes seleccionar un opción'
                })
            } else {
                if (type === RUT_CLIENTE || (type === GRUPO_ECONOMICO && !fromFilters)) {
                    getValue(selectItem)

                } else if (type === GRUPO_ECONOMICO) {
                    getValue({...selectGroupItem, agrupado: true})
                } else {
                    getValue(selectItem)
                }
            }
        } else {
            this.setState({
                error: true,
                errorMssg: 'Debes seleccionar un opción'
            })
        }

    }

    getNameType = (type) => {
        const {fromFilters} = this.props

        switch (type) {
            case TipoBusqueda.EJECUTIVO:
                return 'El participante no existe'
            case TipoBusqueda.RUT_CLIENTE:
                return `Rut consultado no existe${fromFilters ? '' : ', si desea crear presione Crear Cliente'}`
            case TipoBusqueda.GRUPO_ECONOMICO:
                return 'El grupo económico no existe'
            case TipoBusqueda.RESPONSABLE:
                return 'El responsable no existe'
            default:
                return 'Tu búsqueda no existe'
        }
        
    }

    showErrorMessage = () => {
        const {errorMssg} = this.state
        return (
            <View style={styles.errorContainer}>
                <Text style={[styles.errorText, {textAlign: 'center'}]}>
                    {errorMssg}
                </Text>
            </View>
        )
    }

    getItemsList = () => {
        const {list, selectItem, selectGroupItem, searchActive, error} = this.state
        const {fromFilters, type} = this.props
        const {RUT_CLIENTE, GRUPO_ECONOMICO} = TipoBusqueda
        if (type === GRUPO_ECONOMICO && fromFilters) {
            //oculta las empresas en la vista de filtros
            //Solo muestra los GE

            return (<TouchableOpacity onPress={() => {
                this.handleSearchType()
            }} style={styles.buttonProspecto}>
                <Text style={styles.buttonProspectoText}>Buscar </Text>
            </TouchableOpacity>)
        } else {

            //Si no se encuentran resultados de clientes, aparece el boton para crear uno nuevo
            if (_.isEmpty(list)) {
                return (
                    <View>
                        {searchActive && !error ?
                            <View style={styles.errorContainer}>
                                <Text style={[styles.errorText, {textAlign: 'center'}]}>{this.getNameType(type)}</Text>
                            </View> : null
                        }
                        {
                            <TouchableOpacity onPress={() => {
                                this.handleSearchType()
                            }} style={styles.buttonProspecto}>
                                <Text style={styles.buttonProspectoText}>Buscar </Text>
                            </TouchableOpacity>
                        }
                        {
                            !fromFilters && RUT_CLIENTE === type
                                ? <TouchableOpacity onPress={() => {
                                    this.setState({prospectoModalVisible: true})
                                }} style={styles.buttonProspecto}
                                                    {...testID({
                                                        id: `NuevoClienteSearchModalButton`,
                                                        label: `Boton para crear un nuevo cliente`
                                                    })}
                                >
                                    <Text style={styles.buttonProspectoText}>Crear Cliente</Text>
                                </TouchableOpacity>
                                : null
                        }
                    </View>
                )
            }

            //Cards con los resultados de busqueda

            return <View>
                {_.isEmpty(list) ? null :
                    <View>
                        {_.map(_.keys(list), (item, index) => {
                            return <SearchCard key={index}
                                               type={type}
                                               value={list[item]}
                                               active={selectItem}
                                               activeGroup={selectGroupItem}
                                               handleSelectItem={this.handleSelectItem}
                            />
                        })}
                    </View>
                    }
            </View>

        }

    }

    renderSearchSummary = () => {
        const {type, fromFilters} = this.props

        switch (type) {
            case TipoBusqueda.RUT_CLIENTE:
                return 'Resultado Clientes RUT'
            case TipoBusqueda.GRUPO_ECONOMICO:
                return fromFilters ? 'RUTs asociados' : 'Resultado Clientes Grupo'
            case TipoBusqueda.RESPONSABLE:
            default:
                return 'Resultado responsable'
        }
    }

    renderGroupItem = (item) => {
        const {name} = item
        const {GRUPO_ECONOMICO_AGRUPADO} = TipoBusqueda
        const {selectGroupItem} = this.state

        return <SearchCard key={name}
                           type={GRUPO_ECONOMICO_AGRUPADO}
                           value={item}
                           active={selectGroupItem}
                           handleSelectItem={this.handleSelectGroup}
        />
    }

    onFocusKeyboard = () => {
        const {type} = this.props
        const {searchValue} = this.state

        if (type === TipoBusqueda.RUT_CLIENTE) this.setState({searchValue: desformatoRut(searchValue)})
        this.setState({keyboardActive: true, searchActive: false, error: false})
    }

    onBlurKeyboard = () => {
        const {type} = this.props
        const {searchValue} = this.state
        const {RUT_CLIENTE} = TipoBusqueda

        if (type === RUT_CLIENTE) this.setState({searchValue: formatoRut(searchValue)})
        this.setState({keyboardActive: false})
    }


    render() {
        const {type, title, fromFilters} = this.props
        const {keyboardActive, searchValue, list, groupList} = this.state
        const {RUT_CLIENTE} = TipoBusqueda

        return (
            <View style={styles.container}>
                 <NavBar
                    title={title}
                    headerLeft={this.props.headerLeft}
                    headerRight={searchValue || !_.isEmpty(list) ?
                        <EmptyButton onPress={() => this.handleEmptyInput()}/> : []}
                    headerInput={<InputGroup
                        testID={testID({
                            id: `${title}SearchInput`,
                            label: `Contenedor de input de búsqueda de ${title}`
                        })}
                        onChangeText={(value) => this.handleSearchValue(value)}
                        onFocus={() => this.onFocusKeyboard()}
                        onBlur={() => this.onBlurKeyboard()}
                        leftContent={[]}
                        rightContent={[]}
                        onSubmitEditing={() => setTimeout(function () {
                            this.handleSearchType()
                        }.bind(this), 500)}
                        value={searchValue}
                        style={styles.input}
                        placeHolderText={`Buscar por ${title}`}
                        placeholderTextColor={BROWN_GREY}
                        maxLength={type === RUT_CLIENTE ? keyboardActive ? 10 : 13 : 35}
                        keyboardType={'web-search'}
                    />}
                />
                <ScrollView style={styles.formContainer}>
                    {/*mensaje de error modal*/}
                    {this.state.error ? this.showErrorMessage() : null}

                    {/*print GE*/}
                    {_.isEmpty(groupList) ? null :
                        <View>
                            <Text>{`Resultado de búsqueda (${_.size(groupList)})`}</Text>

                            {_.map(groupList, (group, name) => {
                                const {items} = group
                                return this.renderGroupItem({name, items})
                            })}
                        </View>
                    }

                    {/*print title of search*/}
                    {this.state.itemLength > 0 && fromFilters === undefined ?
                        <Text>
                            {this.renderSearchSummary()}: ({this.state.itemLength})
                        </Text>
                        : null}

                    {/*draw search results*/}
                    {this.state.loading ? <Loading/> : this.getItemsList()}


                </ScrollView>

                {_.isEmpty(list) || keyboardActive ? null :
                    <TouchableOpacity onPress={() => this.handleSubmitItem()} style={styles.buttonsContainer}>
                        <Text style={styles.buttonText}>Seleccionar</Text>
                    </TouchableOpacity>
                }

                <Modal animationType={'slide'} transparent={false} visible={this.state.prospectoModalVisible}
                       onRequestClose={() => {
                       }}>
                    <CrearProspectoModal
                        title='Crear Cliente por RUT'
                        getValue={this.onSaveProspecto}
                        defaultValue={searchValue}
                        headerLeft={<GoBackButton onPress={() => {
                            this.setState({prospectoModalVisible: false})
                        }}
                        />}
                    />
                </Modal>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchModal)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
        paddingTop: 20
    },
    formContainer: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        flex: 1
    },
    buttonsContainer: {
        height: 50,
        backgroundColor: GREEN,
        justifyContent: 'center'
    },
    buttonText: {
        color: WHITE,
        textAlign: 'center',
        fontSize: 18,
        textTransform: 'uppercase',
        fontWeight: '500'
    },
    buttonProspecto: {
        flexDirection: 'row',
        height: 44,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: GREEN,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    buttonProspectoText: {
        color: GREEN,
        textAlign: 'center',
        fontSize: 16,
        textTransform: 'capitalize',
    },
    input: {
        top: - 5,
        height: 40,
        backgroundColor: WHITE,
        paddingLeft: 5,
        paddingRight: 5,
        color: BLACK
    },
    errorContainer: {
        backgroundColor: '#ff999f',
        borderWidth: 2,
        borderColor: RED,
        paddingTop: 9,
        paddingRight: 11,
        paddingLeft: 11,
        paddingBottom: 9,
        marginBottom: 20
    },
    errorText: {
        color: RED,
        fontSize: 16
    }
})
