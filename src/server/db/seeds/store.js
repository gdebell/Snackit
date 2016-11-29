
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('store').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('store').insert
        ({
          name: 'Safeway off Yale',
          address: '6460 E Yale Ave',
          city: 'Denver',
          state: 'Colorado',
          zip: 80222,
          lat: 39.6660473,
          long: -104.9142629,
          note: 'Banana\'s available.'
        }),
        knex('store').insert
        ({
          name: 'Safeway in Capital Hill',
          address: '560 Corona St',
          city: 'Denver',
          state: 'Colorado',
          zip: 80218,
          lat: 39.724980,
          long: -104.973275,
          note: 'Snacks ready for pick up.'
        }),
        knex('store').insert
        ({
          name: 'Sprouts Farmers Market',
          address: '2880 S Colorado Blvd',
          city: 'Denver',
          state: 'Colorado',
          zip: 80222,
          lat: 39.6642343,
          long: -104.9394083,
          note: 'Carrots and celery available!'
        }),
        knex('store').insert
        ({
          name: 'Safeway in Uptown',
          address: '2150 S Downing St',
          city: 'Denver',
          state: 'Colorado',
          zip: 80210,
          lat: 39.677453,
          long: -104.972055,
          note: 'Fruit available for pick up.'
        }),
        knex('store').insert
        ({
          name: 'Natural Grocers',
          address: '2375 15th St',
          city: 'Denver',
          state: 'Colorado',
          zip: 80202,
          lat: 39.75638,
          long: -105.009016,
          note: 'Lot\s of organic fruit available for pick up!'
        }),
        knex('store').insert
        ({
          name: 'Kings Soopers in Capital Hill',
          address: '1155 E 9th',
          city: 'Denver',
          state: 'Colorado',
          zip: 80218,
          lat: 39.73112470,
          long: -104.97353640,
          note: 'Produce available for pick up at this location.'
        }),
        knex('store').insert
        ({
          name: 'Kings Soopers at University Hills',
          address: '2750 S Colorado Blvd',
          city: 'Denver',
          state: 'Colorado',
          zip: 80222,
          lat: 39.667551,
          long: -104.940563,
          note: ''
        }),
        knex('store').insert
        ({
          name: 'King Soopers off Speer Blvd',
          address: '1331 Speer Blvd',
          city: 'Denver',
          state: 'Colorado',
          zip: 80204,
          lat: 39.73750180,
          long: -104.99724310,
          note: 'Crackers and fruit packs available for pickup.'
        }),
        knex('store').insert
        ({
          name: 'Trader Joe\'s',
          address: '661 Logan St',
          city: 'Denver',
          state: 'Colorado',
          zip: 80203,
          lat: 39.7264519,
          long: -104.9829914,
          note: 'Banana available.'
        }),
        knex('store').insert
        ({
          name: 'Whole Foods Market',
          address: '900 E 11th Ave',
          city: 'Denver',
          state: 'Colorado',
          zip: 80218,
          lat: 39.7328580,
          long: -104.9758486,
          note: 'Produce available.'
        })
      ]);
    });
};
