export function getCookie(key: string) {
    const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
  }

  export function showprice(price: number | undefined){
    if(price)return (price/100).toFixed(2)+'®'
    return
  }