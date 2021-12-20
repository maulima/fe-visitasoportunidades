# fe-visitasOportunidades

**Problema "Could not find iPhone 6 simulator"**

I solved like this Firstly, you need to go this path

`node_modules/react-native/local-cli/runIOS/findMatchingSimulator.js`

and then You need to change this code

`if (!version.startsWith('iOS') && !version.startsWith('tvOS'))
with
`
`if (!version.startsWith('com.apple.CoreSimulator.SimRuntime.iOS') && !version.startsWith('com.apple.CoreSimulator.SimRuntime.tvOS'))`


**Problema "react-native run-ios` returns Error: Could not find iPhone 6" in the version xCode 11**

`Open the file /node_modules/react-native/local-cli/runIOS/findMatchingSimulator.js`

find on code
`
if (
   simulator.availability !== '(available)'
 ) {
  continue;
}`

add the property
`simulator.isAvailable !== true`

code final
`
if (
   simulator.availability !== '(available)' &&
   simulator.isAvailable !== true
 ) {
  continue;
}`

**problema fixed Xcode 11 App Launch Crash**

show error App

`Unknown argument type 'attribute' in method -[RCTAppState getCurrentAppState:error:]. Extend RCTConvert to support this type.`

and the solution

`open file in yourproject /node_modules/react-native/React/Base/RCTModuleMethod.mm`

and then you need add next line this code

`static BOOL RCTParseUnused(const char **input)
{
  return RCTReadString(input, "__unused") ||
         RCTReadString(input, "__attribute__((unused))");
}`

code final

`static BOOL RCTParseUnused(const char **input)
{
  return RCTReadString(input, "__unused") ||
         RCTReadString(input, "__attribute__((__unused__))") ||
         RCTReadString(input, "__attribute__((unused))");
}`


Then run App

`react-native run-ios --simulator="iPhone 8"``react-native run-ios --simulator="iPhone 8"`
``

Generate release apk for React-Native 0.56.0 project to publish on PlayStore

create keystore file to android/app

`keytool -genkey -v -keystore bci-visitas.keystore -alias bci-visitas -keyalg RSA -keysize 2048 -validity 10000`

Setup your gradle variables in android/gradle.properties

`MYAPP_RELEASE_STORE_FILE=bci-visitas.keystore
MYAPP_RELEASE_KEY_ALIAS=bci-visitas
MYAPP_RELEASE_STORE_PASSWORD=*****
MYAPP_RELEASE_KEY_PASSWORD=*****`

Add signing config to android/app/build.gradle

`android {
signingConfigs {
release {
storeFile file(MYAPP_RELEASE_STORE_FILE)
storePassword MYAPP_RELEASE_STORE_PASSWORD
keyAlias MYAPP_RELEASE_KEY_ALIAS
keyPassword MYAPP_RELEASE_KEY_PASSWORD
}
}
buildTypes {
release {
signingConfig signingConfigs.release
}
}
}`

Generate your release APK

`cd android && ./gradlew assembleRelease`

Install the apk release on device

`cd android && ./gradlew installRelease`
