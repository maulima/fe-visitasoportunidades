import React, {PureComponent} from 'react'
import {View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native'
import testID from '../../custom_node_modules/react-native-testid'

type Props = {
    label: String,
    value: String,
    active: String,
    handleSelectItem: func
}

class RadioHideButtonOportunidad extends PureComponent<Props> {

    state = {
        active: this.props.active
    }

    componentWillReceiveProps(nextProps) {
        const {active} = this.props

        if (active !== nextProps.active) {
            this.setState({active: nextProps.active})
        }
    }

    render() {
        const {active} = this.state
        const {handleSelectItem, value, label, rID} = this.props
        const disabledRadio = active === value ? true : false
        return (
            <View>
                <TouchableOpacity onPress={() => handleSelectItem(value)} style={styles.radioButtonContainer}
                                  disabled={disabledRadio}
                                  {...testID({
                                      id: `${rID}CheckBox ocultar boton Oportunidad`,
                                      label: `Contenedor de checkbox de ocultar boton Oportunidad ${rID}`
                                  })}
                >
                    {
                        active === value
                            ? <Image source={require('./../../assets/images/icons/bool_radiobutton_active_icon.png')}/>
                            : <Image source={require('./../../assets/images/icons/bool_radiobutton_inactive_icon.png')}/>
                    }
                    <View style={styles.itemContainer}
                          {...testID({
                              id: `${rID}TextBoxContainer`,
                              label: `Contenedor de caja de texto de ${rID}`
                          })}
                    >
                        <Text style={styles.label}
                              {...testID({
                                  id: `${rID}TextBox`,
                                  label: `Contenedor de texto de ${rID}`
                              })}
                        >
                            {label}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

export default RadioHideButtonOportunidad

const styles = StyleSheet.create({
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 20,
        paddingLeft: 20
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 15
    },
    label: {
        fontSize: 18,
        marginLeft: 15,
        flexWrap: 'wrap'
    }
})
