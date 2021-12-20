import React, {Component} from 'react'
import {
    View,
    ScrollView,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    TextInput
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import _ from 'lodash'
import testID from '../../custom_node_modules/react-native-testid'

import {BACKGROUND_COLOR, BLACK, BROWN_LIGHT_GREY, GREEN, RED, WHITE} from '../styles/Colors'
import {formatoRut, desformatoRut, getRutAndDv} from '../utils/StringHelper'
import {obtenerMacroBancas} from '../store/actions/macroBancas'
import NavBar from './NavBar'
import InputGroup from './InputGroup'
import ItemListModal from '../components/ItemListModal'
import SearchModal from './SearchModal'
import {TipoBusqueda} from '../constants/Data'
import GoBackButton from './GoBackButton'

const mapStateToProps = (state) => {
    const {env: {API_ENV}} = process

    return {
        currentUser: API_ENV === 'dev' ? state.currentUser.profile : state.auth.profile,
        macroBancas: state.macroBancas.lista,
        colaboradores: state.colaboradores.lista,
        isPushing: state.empresas.isPushing,
        isSaved: state.empresas.isSaved,
        error: state.empresas.hasErrorProspecto || state.empresas.hasError,
        errorMessage: state.empresas.errorMessage
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({obtenerMacroBancas}, dispatch)
    }
}
this.requiredColumns = 3
type Props = {
    title?: String,
    headerLeft?: React.Element<*>,
    defaultValue: String,
    getValue: func
}

class CrearProspectoModal extends Component<Props> {

    state = {
        rut: '',
        rutEditable: true,
        nombre: '',
        usuarioResponsable: '',
        nombreUsuarioResponsable: null,
        responsableModalVisible: false,
        macroBancaModalVisible: false,
        plataforma: null,
        validateForm: false,
        loadingButton: false,
        formTouched: false,
        keyboardActive: false
    }

    componentWillMount() {
        const {
            actions: {obtenerMacroBancas},
            defaultValue,
            colaboradores,
            macroBancas,
            currentUser: {
                nombreCompleto,
                usuario,
                plataforma
            }
        } = this.props

        this.setState({
            rut: defaultValue.trim(),
            rutEditable: defaultValue.trim().length === 0,
            nombreUsuarioResponsable: nombreCompleto,
            usuarioResponsable: usuario,
            plataforma
        })
        if (_.isEmpty(macroBancas)) obtenerMacroBancas()
    }

    componentWillReceiveProps(nextProps) {
        const {isPushing, isSaved, error} = this.props

        if (isPushing !== nextProps.isPushing && nextProps.isPushing) {
            this.handleLoading()
        }

        if (isPushing !== nextProps.isPushing && !nextProps.isPushing) {
            this.handleLoading()
        }

        if (isSaved !== nextProps.isSaved && nextProps.isSaved) {

        }

        if (!error && nextProps.error) {
            this.setState({error: nextProps.error, errorMessage: nextProps.errorMessage, formTouched: false})
        }

    }

    handleLoading = () => {
        this.setState({
            loadingButton: !this.state.loadingButton
        })
    }

    handleError = (errorMssg = null) => {
        if (errorMssg !== 'CLIENTE NO EXISTE') {
            const {rut} = this.state
            const mssg = errorMssg === 'conflict' ?
                `El cliente con el rut ${formatoRut(rut)} ya se encuentra registrado`
                : errorMssg === 'min_length' ?
                    'Rut debe tener un mínimo de 8 caracteres'
                    :
                    'Ha ocurrido un error interno'

            return (
                <View style={{padding: 20, backgroundColor: RED}}>
                    <Text style={{color: WHITE}}>{mssg}</Text>
                </View>
            )
        }
    }

    validationForm = () => {
        const {rut, nombre, nombreUsuarioResponsable, plataforma, macroBanca, macroBancaNombre} = this.state

        if (rut && nombre && nombreUsuarioResponsable && plataforma && macroBanca && macroBancaNombre) {
            return true
        } else {
            return false
        }
    }

    onSetRutCliente = (value) => {
        const rut = value

        this.setState({
            rut,
            formTouched: true
        })

        this.validationForm()
    }

    onSetNombreCliente = (value) => {
        this.setState({
            nombre: value,
            formTouched: true
        })
        this.validationForm()
    }

    onSetResponsable = (value) => {
        this.setState({
            responsableModalVisible: false,
            nombreUsuarioResponsable: value.nombreColaborador,
            usuarioResponsable: value.usuarioNt,
            plataforma: value.centroCosto,
            formTouched: true
        })

        this.validationForm()
    }

    onSetMacroBanca = (value) => {
        const {macroBancas} = this.props

        this.setState({
            macroBanca: value,
            macroBancaNombre: macroBancas[value].name,
            macroBancaModalVisible: false
        })
    }

    onSaveCliente = () => {
        const {rut, nombre, usuarioResponsable, macroBanca, macroBancaNombre} = this.state

        if(rut === null){

        }
        else if (_.size(desformatoRut(rut)) < 8 ) {
            this.setState({error: true, errorMessage: 'min_length', formTouched: false})
        } else {
            const {getValue} = this.props

            let reformatoRut = rut.replace('-', '')
            reformatoRut = reformatoRut.replace('.', '')
            reformatoRut = formatoRut(reformatoRut)
            let valoresRut = getRutAndDv(reformatoRut)

            let params = {
                rut: Number(valoresRut.rut),
                dv: valoresRut.dv,
                usuarioResponsable: usuarioResponsable,
                nombre: nombre,
                macrobanca: {
                    id: macroBanca,
                    macrobancaNombre: macroBancaNombre
                }
            }

            getValue(params)
        }
    }

    renderRutClienteInput = () => {
        const {keyboardActive, rutEditable} = this.state
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>RUT cliente*:</Text>
                <InputGroup
                    editable={rutEditable}
                    testID={testID({
                        id: 'RutClienteInput',
                        label: 'Contenedor de input de rut del cliente'
                    })}
                    secureTextEntry={false}
                    onChangeText={(value) => {
                        this.onSetRutCliente(value)
                    }}
                    onFocus={(value) => {
                        this.setState({rut: desformatoRut(this.state.rut), keyboardActive: true})
                    }}
                    onBlur={(value) => {
                        this.setState({rut: formatoRut(this.state.rut), keyboardActive: false})
                    }}
                    placeHolderText="RUT cliente"
                    placeholderTextColor={BROWN_LIGHT_GREY}
                    autoCapitalize="none"
                    keyboardType={'default'}
                    style={styles.inputText}
                    leftContent={[]}
                    rightContent={[]}
                    value={this.state.rut}
                    maxLength={keyboardActive ? 10 : 13}
                />
            </View>
        )
    }

    renderNombreClienteInput = () => {
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>Nombre cliente*:</Text>
                <InputGroup
                    testID={testID({
                        id: 'NombreClienteInput',
                        label: 'Contenedor de input de nombre del cliente'
                    })}
                    secureTextEntry={false}
                    onChangeText={(value) => {
                        this.onSetNombreCliente(value)
                    }}
                    onBlur={() => {
                    }}
                    placeHolderText="Nombre cliente"
                    placeholderTextColor={BROWN_LIGHT_GREY}
                    autoCapitalize="none"
                    keyboardType={'default'}
                    style={styles.inputText}
                    leftContent={[]}
                    rightContent={[]}
                />
            </View>
        )
    }

    renderResponsableInput = () => {
        const {responsableModalVisible, nombreUsuarioResponsable} = this.state

        return (
            <View style={styles.inputContainer}>
                <Modal animationType={'slide'}
                       transparent={false}
                       visible={responsableModalVisible}
                       onRequestClose={() => {
                       }}
                       key={TipoBusqueda.RESPONSABLE}
                >
                    <SearchModal title='Responsable'
                                 type={TipoBusqueda.RESPONSABLE}
                                 getValue={this.onSetResponsable}
                                 headerLeft={
                                     <GoBackButton onPress={() => {
                                     this.setState({responsableModalVisible: false})
                                 }}/>} key={TipoBusqueda.RESPONSABLE}/>
                </Modal>
                <TouchableOpacity onPress={() => this.setState({responsableModalVisible: true})}>
                    {nombreUsuarioResponsable ? <Text style={styles.inputTitle}>Responsable*:</Text> : null}
                    <View style={styles.itemContainer}>
                        <Text
                            style={styles.inputText}>{nombreUsuarioResponsable ? nombreUsuarioResponsable : 'Responsable*'}</Text>
                        <Image style={{marginRight: 10}}
                               source={require('./../../assets/images/icons/down_arrow_icon.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderMacroBancaInput = () => {
        const {macroBancas} = this.props
        const {macroBancaModalVisible, macroBanca, macroBancaNombre} = this.state
        const pID = `PMACROBANCAPROSPECTO`

        return (
            <View>
                <View style={styles.inputContainer}>
                    <Modal animationType={'slide'} transparent={false} visible={macroBancaModalVisible}
                           onRequestClose={() => {
                           }}>
                        <ItemListModal
                            list={macroBancas}
                            saveSelection={(value) => this.onSetMacroBanca(value)}
                            title={'Lista de macrobancas'}
                            headerLeft={<GoBackButton onPress={() => {
                                this.setState({macroBancaModalVisible: false})
                            }}/>}
                            type={'ANY'}
                            pID={pID}
                            defaultValue={macroBanca}/>
                    </Modal>

                    <TouchableOpacity onPress={() => this.setState({macroBancaModalVisible: true})}
                                      {...testID({
                                          id: `${pID}SimpleInput`,
                                          label: `Contenedor de selección simple de macrobanca`
                                      })}
                    >
                        {macroBancaNombre ? <Text style={styles.inputTitle}>{`Macrobanca*`}</Text> : null}
                        <View style={styles.itemContainer}
                              {...testID({
                                  id: `${pID}TextBoxContainer`,
                                  label: `Contenedor de caja de texto de macrobanca`
                              })}
                        >
                            <Text style={styles.inputText}
                                  {...testID({
                                      id: `${pID}TextBox`,
                                      label: `Contenedor de texto de macrobanca`
                                  })}
                            >
                                {macroBancaNombre || 'Macrobanca*'}</Text>
                            <Image style={{marginRight: 10}}
                                   source={require('./../../assets/images/icons/down_arrow_icon.png')}/>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderProspectoForm = () => {
        const {plataforma} = this.state

        return (
            <View style={styles.prospectoFormContainer}>
                {this.renderRutClienteInput()}
                {this.renderNombreClienteInput()}
                {this.renderResponsableInput()}

                <View style={styles.inputContainer}>
                    <Text style={styles.inputTitle}>Plataforma*:</Text>
                    <Text style={styles.inputDisableText}>{plataforma ? plataforma : '-'}</Text>
                </View>

                {this.renderMacroBancaInput()}
            </View>
        )
    }

    render() {
        const {loadingButton, formTouched, error, errorMessage} = this.state

        return (
            <View style={styles.container}>
                <NavBar title={this.props.title} headerLeft={this.props.headerLeft} headerInput={false}/>
                <ScrollView>
                    {!formTouched && error ? this.handleError(errorMessage) : null}
                    {this.renderProspectoForm()}
                </ScrollView>
                <TouchableOpacity onPress={() => {
                    this.validationForm() ? this.onSaveCliente() : null
                }} style={this.validationForm() ? styles.button : styles.buttonDisabled}>
                    <Text style={styles.buttonText}>Crear Cliente</Text>
                    {loadingButton && <ActivityIndicator size="small" color="white"/>}
                </TouchableOpacity>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CrearProspectoModal)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: BACKGROUND_COLOR,
    },
    button: {
        backgroundColor: GREEN,
        flexDirection: 'row',
        justifyContent: 'center',
        height: 50,
        alignItems: 'center'
    },
    buttonDisabled: {
        backgroundColor: BROWN_LIGHT_GREY,
        flexDirection: 'row',
        justifyContent: 'center',
        height: 50,
        alignItems: 'center'
    },
    buttonText: {
        color: WHITE,
        textAlign: 'center',
        fontSize: 18,
        textTransform: 'uppercase',
        fontWeight: '500'
    },
    prospectoFormContainer: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20
    },
    inputContainer: {
        borderBottomWidth: 1,
        borderBottomColor: BLACK,
        paddingBottom: 10,
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 30
    },
    inputTitle: {
        fontSize: 12,
        marginBottom: 5
    },
    inputText: {
        fontSize: 16,
        textTransform: 'capitalize'
    },
    inputDisableText: {
        fontSize: 16,
        textTransform: 'capitalize',
        color: BROWN_LIGHT_GREY,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
})
