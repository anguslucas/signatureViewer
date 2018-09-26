import axios from 'axios';

//currently having dependency issues installing request-promise-native properly


export function getRequest (url) {

    return axios.get(url)

}
