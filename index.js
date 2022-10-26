// Load in dependencies
var Spritesmith = require('spritesmith');
var fs = require('fs');
const path = require('path');

const pngPath = 'US_Redistricting/sprite_images';
const output = 'US_Redistricting/sprites/image_sprite';

fs.readdir(pngPath, (err, sprites) => {

  var procSprites = sprites.map(s => pngPath+'/'+s)
  var spritesmith = new Spritesmith();

  spritesmith.createImages(procSprites, function handleImages(err, images) {
    if (err) {
      console.log(err)
    }

    // Create our result
    var result = spritesmith.processImages(images);
    result.image; // Readable stream outputting image

    result.coordinates; // Object mapping filename to {x, y, width, height} of image
    result.properties; // Object with metadata about spritesheet {width, height}
    let writePath = path.join(__dirname, output);
    let _json = result.coordinates;

    Object.keys(_json).forEach((old_key)=>{
      _json[old_key].pixelRatio = 1;

      let new_key = old_key.replace(pngPath,"").replace(".png","").replace(".svg","").replace("/","").replace("  "," ");

      if (old_key !== new_key) {
        Object.defineProperty(_json, new_key,
            Object.getOwnPropertyDescriptor(_json, old_key));
        delete _json[old_key];
    }
    })

    function writeOut(_writePath){

    const destination = fs.createWriteStream(_writePath+".png")

    result.image.pipe(destination);

    fs.writeFile(_writePath+".json", JSON.stringify(result.coordinates, null, '\t'), (err) => {
      if (err) {
        console.log('Failed to write updated data to file');
        return;
      }
      console.log('Updated file successfully');
    });
    }

    writeOut(writePath)
    writeOut(writePath+'@2x')
  });
});