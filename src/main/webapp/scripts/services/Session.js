
bootstrapServices.factory('Session', function () {
    this.create = function (login, firstName, lastName, email, userRoles, gender, moduleRights) {
        this.login = login;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.userRoles = userRoles;
        this.gender=gender;
        this.moduleRights = moduleRights;
    };

    this.invalidate = function () {
        this.login = null;
        this.firstName = null;
        this.lastName = null;
        this.email = null;
        this.userRoles = null;
        this.gender=null;
        this.moduleRights=null;
    };

    return this;
});