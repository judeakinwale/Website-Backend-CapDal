import { ModelRepository } from "../../shared/model.repository";
import { InternalUser } from "../../../types/user";

class UserRepository extends ModelRepository<InternalUser> {}

export default UserRepository;
