import { Platform, Dimensions } from 'react-native'
import { BACKGROUND_COLOR } from './Colors'

const { width } = Dimensions.get('window')

export const HEADER_STYLE = {
    headerStyle: {
        backgroundColor: BACKGROUND_COLOR,
        borderBottomColor: BACKGROUND_COLOR,
        elevation: null,
        height: Platform.OS === 'ios' ? 30 : 60,
        width: width
    },
}
