import { useParams } from "react-router-dom";

const CategoryDetail = () => {
  const { id } = useParams();

  console.log(id);
  return <div>CategoryDetail</div>;
};

export default CategoryDetail;
