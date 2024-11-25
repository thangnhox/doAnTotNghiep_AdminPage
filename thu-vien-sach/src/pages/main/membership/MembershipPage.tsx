import { useState } from "react";
import Membership from "../../../models/Membership";

interface PageState {
  isLoading: boolean,
  memberships: Membership[]
}

const MembershipPage = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  return <div>MembershipPage</div>;
};

export default MembershipPage;
