import React, {PureComponent} from 'react'
import {View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native'
import testID from '../../custom_node_modules/react-native-testid'

import {BACKGROUND_COLOR, BROWN_LIGHT_GREY} from '../styles/Colors'

type Props = {
    label: String,
    value: String,
    active: String,
    handleSelectItem: func
}

class RadioButton extends PureComponent<Props> {

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

        return (
            <View>
                <TouchableOpacity onPress={() => handleSelectItem(value)} style={styles.radioButtonContainer}
                                  {...testID({
                                      id: `${rID}CheckBox`,
                                      label: `Contenedor de checkbox de ${rID}`
                                  })}
                >
                    {
                        active === value
                            ? <Image source={require('./../../assets/images/icons/radiobutton_active_icon.png')}/>
                            : <Image source={require('./../../assets/images/icons/radiobutton_inactive_icon.png')}/>
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

export default RadioButton

const styles = StyleSheet.create({
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 20,
        paddingLeft: 20,
        borderBottomWidth: 1,
        borderBottomColor: BROWN_LIGHT_GREY
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
