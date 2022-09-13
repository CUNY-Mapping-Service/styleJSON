// Load in dependencies
var Spritesmith = require('spritesmith');
var fs = require('fs');

const pngPath = 'IMAGE_NYC/pngs';
const output = 'test_2'

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

    const destination = fs.createWriteStream(output+".png")

    result.image.pipe(destination);

    fs.writeFile(output+".json", JSON.stringify(result.coordinates), (err) => {
      if (err) {
        console.log('Failed to write updated data to file');
        return;
      }
      console.log('Updated file successfully');
    });
  });
});