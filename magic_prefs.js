

var InsideTrader = InsideTrader || {};

//var MagicPrefs = MagicPrefs || {};

/**
 * Config Saver Class
 *
 * Requires JSON2.js
 */
var MagicPrefs = function( db_name, callback ){
	LogIt( 'MagicPrefs constructor' );
	
    if( !window.openDatabase || '' == db_name ){
        return null;
    }
    
    this.db = openDatabase( db_name );
    
	var self = this;
    this.db.transaction(         
            function(tx) {
                tx.executeSql("SELECT COUNT(*) FROM SaveData", [], 
					function(result) {
                    	self.LoadSaveData( callback );
	                }, 
            
	                function(tx, error) {
	                    tx.executeSql("CREATE TABLE SaveData( name TEXT UNIQUE, data TEXT )", [], function(result) { 
	                        self.LoadSaveData( callback ); 
	                    });
	                }
				);
            }
    );
}

MagicPrefs.prototype.db = null;
MagicPrefs.prototype.data = [];

function dateFilter(k, v) {
 return (typeof v == "string"
  && (k=v.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})Z$/))) ? new Date(Date.UTC(k[1],k[2]-1,k[3],k[4],k[5],k[6])) : v;
}

MagicPrefs.prototype.LoadSaveData = function( callback ){
	var self = this;
    this.db.transaction(function(tx) {
        tx.executeSql("SELECT name, data FROM SaveData", [], function(tx, result) {
            	for (var i = 0; i < result.rows.length; ++i) {
	                var row = result.rows.item(i);
		
					if( row['name'] != 'undefined' ){
						LogIt( 'Got saved data. ' + row['name'] + ':' + row['data'] );
						
						self.data[row['name']] = JSON.parse( row['data'], dateFilter );
						
                		/*
							self.data.push( {
	                        name: row['name'],
	                        data: JSON.parse( row['data'], dateFilter )
	                    } );
						*/
					}
	            }
	
	            if (!result.rows.length){
	                //No data to load.
	            } 
	
				//Call the callback function.
				setTimeout( callback, 0 );
			}, 

			function(tx, error) {
                alert('Failed to retrieve notes from database - ' + error.message);
                return;
            } 
		);
    });
}

MagicPrefs.prototype.SavePref = function( name, val ){
	//this.data = [];
	this.data[name] = null;
		this.data[name] = val;
	this.SaveData();
}

MagicPrefs.prototype.GetPref = function( name ){
	if( this.data[name] ){
		return this.data[name];
	}else{
		return null;
	}
}

MagicPrefs.prototype.SaveData = function(){
	function makeClosure(i, data) { 
	    return function( tx ){ 
        	return tx.executeSql( "INSERT OR REPLACE INTO SaveData( name, data ) VALUES( ?, ? )", [i, data ] ); 
        } 
    }
	
	for( var i in this.data ){
		if( i && i != 'undefined' ){
			var this_data = this.data[i];
		
			//Convert to JSON
			this_data = JSON.stringify( this_data, function (key, value) {
			    return value;
			});
		
			LogIt( 'Saving item ' + i + ' value: ' + this_data );
		
			this.db.transaction(
				makeClosure( i, this_data ),
				function( err ){
					//alert( 'Error with statement: ' + err.message );
				},
				function( sec ){
					//alert( 'Successful statement ' );
				}
			);
		}
	}
}

MagicPrefs.prototype.EraseData = function(){
	LogIt( 'EraseData' );
	this.db.transaction(
		function( tx ){
			tx.executeSql( "DROP TABLE SaveData" );
		}
	);
}