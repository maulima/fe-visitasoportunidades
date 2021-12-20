import React, { PureComponent } from 'react'
import { TouchableOpacity, Text } from 'react-native'
import _ from 'lodash'
import { Col, Row } from './Grid'

import testID from '../../custom_node_modules/react-native-testid'
import styles from '../styles/components/EstadosOportunidad'

type Props = {
    label: String,
    value: String,
    changeTabValue: Function
}

class SimpleTabs extends PureComponent<Props> {

    render() {
        const { value, list, responseData, onSetSimpleTabsInput, key, editable, pID } = this.props
        const lastIndex = _.size(list) - 1
        let i = 0

        return (
            <Row key={ key } style={ styles.container }>
                { _.map(list, (respuesta, k2) => {
                    const tabContainerStyle = []
                    const tabName = respuesta.name

                    if (lastIndex > 0) {
                        if (i === 0) {
                            tabContainerStyle.push( styles.leftTabContainer )
                        } else if (i === lastIndex) {
                            tabContainerStyle.push( styles.rightTabContainer )
                        }
                    }

                    i++

                    const rID = `${pID}R${i}`

                    return (
                        <Col key={ k2 } size={33.333}>
                            <TouchableOpacity onPress={ () => editable ? onSetSimpleTabsInput(k2, responseData) : null }
                                {...testID({
                                    id: `${rID}TabButton`,
                                    label: `Contenedor de boton de ${tabName}`
                                })}
                            >
                                <Row style={ tabContainerStyle }>
                                    <Text style={ (!value && i === 1) || value === k2 ? [styles.tabText, styles.tabTextActive] : styles.tabText }
                                        {...testID({
                                            id: `${rID}TextBox`,
                                            label: `Contenedor de texto de ${tabName}`
                                        })}
                                    >
                                        { tabName }
                                    </Text>
                                </Row>
                            </TouchableOpacity>
                        </Col>
                    )
                })}
            </Row>
        )
    }
}

export default SimpleTabs
