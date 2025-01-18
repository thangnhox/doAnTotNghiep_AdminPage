import { Card, Spin } from "antd";
import { useEffect, useState } from "react";
import { UserAgeStatisticModel } from "../../../models/UserAgeStatistic";
import UserAgeStatistic from "../../components/UserAgeStatistic";
import { AxiosResponse } from "axios";
import { handleAPI } from "../../../remotes/apiHandle";
import { ResponseDTO } from "../../../dtos/Response/ResponseDTO";

const HomePage = () => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [userAgeStatistic, setUserAgeStatistic] = useState<UserAgeStatisticModel[]>([])

  useEffect(() => {
    getStatisticData();
  }, [])


  const getStatisticData = async () => {
    try {
      setLoading(true)
      const res: AxiosResponse<ResponseDTO<UserAgeStatisticModel[]>> = await handleAPI(`/admin/userStatistic`);
      setUserAgeStatistic(res.data.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return isLoading ? <Spin /> : <div className="container-fulid">
    <div className="row">
      <div className="col-8">
        <Card title="Nhóm tuổi">
          <div className="d-flex flex-row gap-3 justify-content-center ">
            {
              userAgeStatistic.map((item) => <UserAgeStatistic title={item.AgeGroup} value={item.UserCount} />)
            }
          </div>
        </Card>
      </div>
      <div className="col-4">
        <Card title="Nhóm sách" ></Card>
      </div>
    </div>
  </div>;
};

export default HomePage;
