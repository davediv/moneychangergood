function addSymbol(amount,currencyCode ){
return new Intl.NumberFormat( "id-ID",{style:"currency", currency:`${currencyCode}`}).format(amount)
}

module.exports = addSymbol
