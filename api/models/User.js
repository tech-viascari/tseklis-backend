// User model
class User {
  constructor({
    user_id = "",
    user_name = "",
    user_email = "",
    created_at = "",
    updated_at = "",
  } = {}) {
    this.user_id = user_id;
    this.user_name = user_name;
    this.user_email = user_email;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

export default User;
