
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('school').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('school').insert
        ({name: 'East High School',
          address: '1600 City Park Esplanade',
          city: 'Denver',
          state: 'Colorado',
          zip: 80206,
          lat: 39.7416,
          long: 104.9560,
          photo_url: 'http://east.dpsk12.org/wp-content/uploads/2013/10/denver-east-high-school-e1382648407878.png'}),
        knex('school').insert
        ({name: 'Thomas Jefferson High School',
          address: '3950 S Holly St',
          city: 'Denver',
          state: 'Colorado',
          zip: 80237,
          lat: 39.6469,
          long: 104.9213,
          photo_url: 'http://www.athletics.tjcctweb.com/wp-content/uploads/2014/06/TJ-Statue.jpg'}),
        knex('school').insert
        ({name: 'The Denver Waldorf School',
          address: '2100 S Pennsylvania St',
          city: 'Denver',
          state: 'Colorado',
          zip: 80210,
          lat: 39.6779,
          long: 104.9812,
          photo_url: 'http://denverwaldorf.org/wp-content/uploads/6th-grade.jpg'}),
        knex('school').insert
        ({name: 'International School of Denver',
          address: '7701 E 1st Pl',
          city: 'Denver',
          state: 'Colorado',
          zip: 80230,
          lat: 39.7225,
          long: 104.8965,
          photo_url: 'http://67.media.tumblr.com/083282cf6e41a49d01c98a7f9a71432a/tumblr_nnwh15IlAE1qmpbgoo1_500.jpg'}),
        knex('school').insert
        ({name: 'Denver Green School',
          address: '6700 E Virginia Ave',
          city: 'Denver',
          state: 'Colorado',
          zip: 80224,
          lat: 39.7068,
          long: 104.9090,
          photo_url: 'https://static1.squarespace.com/static/5367a1b2e4b01e9923ed0b2d/t/547aa579e4b066b3423bebb1/1417323902146/'}),
        knex('school').insert
        ({name: 'Montessori School of Denver',
          address: '1460 S Holly St',
          city: 'Denver',
          state: 'Colorado',
          zip: 80222,
          lat: 39.6901,
          long: 104.9220,
          photo_url: 'https://s3-media3.fl.yelpcdn.com/bphoto/B0n_MhUdHNEti2ZgKDIpHw/ls.jpg'}),
        knex('school').insert
        ({name: 'Steck Elementary School',
          address: '450 Albion Street',
          city: 'Denver',
          state: 'Colorado',
          zip: 80220,
          lat: 39.7237,
          long: 104.9386,
          photo_url: 'http://detroitk12.org/content/wp-content/uploads/2012/10/1.photo_.jpg'}),
        knex('school').insert
        ({name: 'Valverde Elementary School',
          address: '2030 W Alameda Ave',
          city: 'Denver',
          state: 'Colorado',
          zip: 80223,
          lat: 39.7104,
          long: 105.0114,
          photo_url: 'http://coloradoindependent.com/wp-content/uploads/DSC06872-1-e1435844636461.jpg'}),
        knex('school').insert
        ({name: 'Place Bridge Academy',
          address: '7125 Cherry Creek N Dr',
          city: 'Denver',
          state: 'Colorado',
          zip: 80224,
          lat: 39.6884,
          long: 104.9060,
          photo_url: 'http://place.dpsk12.org/wp-content/uploads/2013/11/DSC04823.jpg'}),
        knex('school').insert
        ({name: 'Ellis Elementary School',
          address: 'Address: 1651 S Dahlia St',
          city: 'Denver',
          state: 'Colorado',
          zip: 80222,
          lat: 39.6870,
          long: 104.9324,
          photo_url: 'http://www.fuesd.k12.ca.us/cms/lib5/CA01000513/Centricity/ModuleInstance/6142/large/rsz_library_leaders.jpg?rnd=0.665997338791377'})
      ]);
    });
};
