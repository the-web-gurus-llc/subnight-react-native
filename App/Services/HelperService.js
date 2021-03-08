import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob'
import { base_url } from './../Network/URLProvider'
import base64 from 'react-native-base64'

const myEncodedApiKey = "QUl6YVN5QXRELTVkRzhPa1U4MlRJWTAwa1VtUFQtVUtkaHp3SlE0"
const API_KEY = base64.decode(myEncodedApiKey)

export function thousands_separators(num) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}

export const _storeData = async userToken => {
    try {
        await AsyncStorage.setItem("userToken", JSON.stringify(userToken));
    } catch (error) {
        // Error saving data
    }
};

export function userGender(gender) {
    if (gender === "male" || gender === "Male") return "Male";
    if (gender === "female" || gender === "Female") return "Female";
    return "Other";
}

export function userPhoneNumber(phoneNumber) {
    return phoneNumber.replace(" ", "+");
}

export function containedString(str1, str2) {
    return str1.toLowerCase().includes(str2.toLowerCase());
}

export function generateRandomEmail() {
    return (new Date()).getTime().toString()
}

export function uploadUserAvatar(access_token, photoUri) {
    const mediaField = {
        name: 'image',
        filename: 'image.jpg',
        mime: 'image/jpeg',
        data: RNFetchBlob.wrap(photoUri.replace('file://', ''))
    }
    console.log(mediaField);

    return RNFetchBlob.fetch(
        'POST',
        `${base_url}/users/upload-avatar`, {
        Authorization: 'Bearer ' + access_token,
        'Content-Type': 'multipart/form-data'
    },
        [mediaField]
    )
}

export async function getPlaceDetailWithCoordinates(lat, long, callback) {
    console.log(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${API_KEY}`);
    var request = new XMLHttpRequest();
    request.onreadystatechange = e => {
        if (request.readyState !== 4) {
            return;
        }

        if (request.status === 200) {
            callback(JSON.parse(request.responseText).results);
        } else {
            console.warn("error");
        }
    };

    request.open(
        "GET",
        `https://maps.googleapis.com/maps/api/geocode/json?address=${lat},${long}&key=${API_KEY}`
    );
    request.send();
}