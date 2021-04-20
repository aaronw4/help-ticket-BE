exports.up = function(knex) {
    return knex.schema
      .createTable("roles", tbl => {
        tbl.increments();
        tbl
          .string("role")
          .unique()
          .notNullable();
      })
      .createTable("users", tbl => {
        tbl.increments();
        tbl
          .string("username")
          .unique()
          .notNullable();
        tbl.string("password").notNullable();
      })
      .createTable("users_roles", tbl => {
        tbl
          .integer("userId")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("users")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        tbl
          .integer("roleId")
          .unsigned()
          .references("id")
          .inTable("roles")
          .onUpdate("CASCADE")
          .onDelete("CASCADE")
          .defaultTo(1);
        tbl.primary(["userId", "roleId"]);
      })
      .createTable("categories", tbl => {
        //table exist but not used, because category was changed to a string instead of a table of strings
        tbl.increments();
        tbl
          .string("category")
          .notNullable()
          .unique();
      })
      .createTable("tickets", tbl => {
        tbl.increments();
        tbl.string("title").notNullable();
        tbl.string("description").notNullable();
        tbl.string("attempted").notNullable();
        // tbl
        //   .integer("categoryId")
        //   .unsigned()
        //   .notNullable()
        //   .references("id")
        //   .inTable("categories")
        //   .onDelete("CASCADE")
        //   .onUpdate("CASCADE");
        tbl.string("category").notNullable();
        tbl
          .integer("userId")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("users")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        tbl.boolean("openStatus").defaultTo(true);
        tbl.boolean("resolved").defaultTo(false);
      })
  
      .createTable("users_tickets", tbl => {
        tbl
          .integer("userId")
          .unsigned()
          .references("id")
          .inTable("users")
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
        tbl
          .integer("ticketId")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("tickets")
          .onUpdate("CASCADE")
          .onDelete("CASCADE")
          .primary();
      });
  };
  
  exports.down = function(knex) {
    return knex.schema
      .dropTableIfExists("users_tickets")
      .dropTableIfExists("tickets")
      .dropTableIfExists("categories")
      .dropTableIfExists("users_roles")
      .dropTableIfExists("users")
      .dropTableIfExists("roles");
  };
  