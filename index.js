var tcmbDovizKuru = require('tcmb-doviz-kuru');
var pg = require('pg');
var moment = require("moment");

function cb(error, data) {
    if (error) {
        console.log('error', error)
    }
    console.log(JSON.stringify(data));
    insertToDatabase(data);
}

function insertToDatabase(data){
  var connectionString = "postgres://someuser:somepassword@somehost:381/somedatabase";
    var pgClient = new pg.Client(connectionString);
    pgClient.connect();

  const usdInfo = data['tarihDate']['currency'];

    for ( let element of usdInfo ) {
      
      let dataString = moment().format("YYYY-MM-DDTHH:mm:ss");
    
      let val = [ dataString, element.forexSelling, element.forexBuying, element.banknoteBuying, element.banknoteSelling, element.unit, element.isim, element.attributes.kod ];
      const queryString = 'INSERT INTO doviz.kur("date","dolar_efektif_satis_kur", "dolar_efektif_alis_kur", "dolar_doviz_alis_kur", "dolar_doviz_satis_kur", "birim","isim","kod") VALUES( $1, $2, $3, $4, $5, $6, $7, $8 )';

      pgClient
        .query(queryString, val)
        .then(res => {
          console.log("inserted")
        })
        .catch(e => console.error("error",e))

    }

}

tcmbDovizKuru(cb);