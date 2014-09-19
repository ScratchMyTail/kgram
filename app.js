/*
 * Module dependencies
 */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , Instagram = require('instagram-node-lib')

var app = express()

/* Folders */
app.use(express.static(__dirname + '/public'))
app.use("/style", express.static(__dirname + '/style'));
app.use("/imgs", express.static(__dirname + '/imgs'));

/* Instagram stuff */
Instagram.set('client_id', '8d39c36dfe084fad89213204784983b1');
Instagram.set('client_secret', '82a20555948244c295be447109f6357e');

app.configure('development', function(){
  app.use(express.errorHandler());
  app.locals.pretty = true;
});

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))


app.get('/', function (req, res) {
  res.render('index',{ title : 'Nysjerrigpergram' });
})

app.get('/insta', function(req, res){
	Instagram.tags.recent({name: 'hauknes', complete: function(data){
		res.send(data);
	}
	})
});

app.get('/loc', function(req, res){
  /* RANAHALLEN: id=56918333*/
  /* KOKS: id=15158830*/
  Instagram.locations.recent({location_id: 15158830, complete: function(data){
    res.send(data);
  }
  })
});

app.get('/findloc', function(req, res){
  Instagram.locations.search({lat: 66.310914, lng: 14.137752, complete: function(data){
    res.send(data);
  }
  })
})

app.listen(3000)