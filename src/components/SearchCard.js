import React, {PureComponent} from 'react'
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native'

import {BROWN_GREY, WHITE} from '../styles/Colors'
import {TipoBusqueda} from '../constants/Data'
import {formatoRut} from '../utils/StringHelper'

import * as _ from 'lodash'
import testID from '../../custom_node_modules/react-native-testid'

type Props = {
    type?: String,
    value: Object,
    active: Object,
    activeGroup: Object,
    handleSelectItem: func
}

class SearchCard extends PureComponent<Props> {

    state = {
        active: this.props.active
    }

    componentWillReceiveProps(nextProps) {
        const {active} = this.props

        if (active !== nextProps.active) {
            this.changeSelectedItem(nextProps.active)
        }
    }

    changeSelectedItem = (value) => {
        this.setState({
            active: value
        })
    }

    //Card de colaborador
    renderPersona = () => {
        const {active} = this.state
        const {handleSelectItem, value} = this.props

        return (
            //Boton seleccion de colaborador
            <TouchableOpacity onPress={() => handleSelectItem(value)}
                              style={[styles.container, styles.containerPersona]}
                              {...testID({
                                  id: `SeleccionColaboradorSearchCardButton`,
                                  label: `Botón para seleccionar un nuevo colaborador`
                              })}
            >
                <View style={styles.itemContainer}
                      {...testID({
                          id: `ColaboradorSearchCardContainer`,
                          label: `Contenedor de la informacion del colaborador`
                      })}
                >
                    <View>
                        <Text style={styles.email}
                              {...testID({
                                  id: `EmailColaboradorSearchCardLabel`,
                                  label: `texto email del colaborador`
                              })}
                        >{value.usuarioNt}@bci.cl</Text>
                        <Text style={styles.name}
                              {...testID({
                                  id: `NombreColaboradorSearchCardLabel`,
                                  label: `Texto nombre del colaborador`
                              })}
                        >{value.nombreColaborador}</Text>
                    </View>
                    {
                        _.isEqual(active, value)
                            ? <Image source={require('./../../assets/images/icons/radiobutton_active_icon.png')}/>
                            : <Image source={require('./../../assets/images/icons/radiobutton_inactive_icon.png')}/>
                    }
                </View>

                {/*<View style={ styles.detailsContainer }>*/}
                {/*<View style={{ width: 20, height: 20 }}>*/}
                {/*<Image style={{  }} source={ require('./../../assets/images/icons/location_icon.png') } />*/}
                {/*</View>*/}
                {/*<Text style={ styles.detailText }>-</Text>*/}
                {/*</View>*/}
                {/*<View style={ styles.detailsContainer }>*/}
                {/*<View style={{ width: 20, height: 20 }}>*/}
                {/*<Image style={{  }} source={ require('./../../assets/images/icons/profile_icon.png') } />*/}
                {/*</View>*/}
                {/*<Text style={ styles.detailText }>-</Text>*/}
                {/*</View>*/}
                {/*Informacion de la plataforma del colaborador*/}
                <View style={styles.detailsContainer}>
                    <View style={{width: 20, height: 20}}>
                        <Image style={{}} source={require('./../../assets/images/icons/star_icon.png')}/>
                    </View>
                    <Text style={styles.detailText}
                          {...testID({
                              id: `PlataformaColaboradorSearchCardLabel`,
                              label: `Texto nombre de la plataforma del colaborador`
                          })}
                    >{value.centroCosto}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    //Cards de empresas(clientes)
    renderEmpresa = () => {
        const {active} = this.state
        const {handleSelectItem, value, activeGroup} = this.props
        let rut = formatoRut(value.rut + value.digitoVerificador)
        return (
            <TouchableOpacity onPress={() => handleSelectItem(value)}
                              style={[styles.container, styles.containerEmpresa]}
                              {...testID({
                                  id: `SeleccionClienteSearchCardButton`,
                                  label: `Botón para seleccionar un nuevo cliente`
                              })}
            >
                <View style={styles.itemContainer}
                      {...testID({
                          id: `ClienteSearchCardContainer`,
                          label: `Contenedor de la informacion del cliente`
                      })}>
                    <View>
                        <Text style={styles.name} numberOfLines={2}
                              {...testID({
                                  id: `NombreClienteSearchCardLabel`,
                                  label: `texto nombre del cliente`
                              })}
                        >{value.nombreEmpresa}</Text>
                    </View>
                    {
                        _.isEqual(active, value) || (!_.isEmpty(activeGroup) && _.lowerCase(activeGroup.name) === _.lowerCase(value.nombreGrupo))
                            ? <Image source={require('./../../assets/images/icons/radiobutton_active_icon.png')}/>
                            : <Image source={require('./../../assets/images/icons/radiobutton_inactive_icon.png')}/>
                    }
                </View>
                <View style={styles.detailsContainer}>
                    <View style={{width: 20, height: 20}}>
                        <Image style={{}} source={require('./../../assets/images/icons/iden_user.png')}/>
                    </View>
                    <Text style={styles.detailText}
                          {...testID({
                              id: `RutClienteSearchCardLabel`,
                              label: `texto rut del cliente`
                          })}
                    >{rut}</Text>
                </View>
                <View style={styles.detailsContainer}>
                    <View style={{width: 20, height: 20}}>
                        <Image style={{}} source={require('./../../assets/images/icons/net_icon.png')}/>
                    </View>
                    <Text style={styles.detailText}
                          {...testID({
                              id: `GrupoEconomicoClienteSearchCardLabel`,
                              label: `texto nombre del grupo economico del cliente`
                          })}
                    >{value.nombreGrupo ? value.nombreGrupo : '-'}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    //Cards de GE (Grupo economico)
    renderGrupo = () => {
        const {active} = this.state
        const {handleSelectItem, value} = this.props

        return (
            <TouchableOpacity onPress={() => handleSelectItem(value)} style={[styles.container, styles.containerGrupo]}>
                <View>
                    <View style={[styles.itemContainer, {marginBottom: 5}]}>
                        <Text style={[styles.name, styles.nombreGrupo]} numberOfLines={2}>
                            {_.upperCase(value.name)}
                        </Text>
                        {
                            _.isEqual(active, value)
                                ? <Image source={require('./../../assets/images/icons/radiobutton_active_icon.png')}/>
                                : <Image source={require('./../../assets/images/icons/radiobutton_inactive_icon.png')}/>
                        }
                    </View>

                    <View style={styles.itemContainer}>
                        <Text style={[styles.detailText, {marginLeft: 0}]}>{`${value.items} (RUTs asociados)`}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }


    render() {
        const {type} = this.props
        const {GRUPO_ECONOMICO, RUT_CLIENTE, GRUPO_ECONOMICO_AGRUPADO} = TipoBusqueda
        if (type === GRUPO_ECONOMICO || type === RUT_CLIENTE) {
            return this.renderEmpresa()
        } else if (type === GRUPO_ECONOMICO_AGRUPADO) {
            return this.renderGrupo()
        } else {
            return this.renderPersona()
        }
    }
}

export default SearchCard

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginBottom: 10,
        paddingTop: 10,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: WHITE,
        shadowOffset: {
            width: 4,
            height: 4
        },
        shadowColor: BROWN_GREY,
        shadowOpacity: 0.2,
        borderRadius: 4,
    },
    containerEmpresa: {
        height: 125,
    },
    containerPersona: {
        height: 120,
    },
    containerGrupo: {
        height: 'auto'
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    email: {
        textTransform: 'uppercase',
        fontWeight: '600',
        marginBottom: 10
    },
    name: {
        textTransform: 'capitalize',
        width: 255
    },
    nombreGrupo: {
        textTransform: 'none',
        fontWeight: 'bold'
    },
    detailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    detailText: {
        marginLeft: 10,
        fontWeight: '500',
        textTransform: 'capitalize',
    }
})
