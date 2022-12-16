export const getError = (error) => {
    return error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
};

export function formatPrice(price){
    price = price.toLocaleString('it-IT');
    return price + 'đ';
}