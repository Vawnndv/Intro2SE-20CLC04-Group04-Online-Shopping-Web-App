import data from "./data";

export const getError = (error) => {
    return error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
};

export function formatPrice(price){
    price = price.toLocaleString('it-IT');
    return price + 'đ';
}

export function formatDate(date){
    let s = date.split("T");
    
    return s[0]
}