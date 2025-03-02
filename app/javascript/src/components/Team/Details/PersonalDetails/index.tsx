import React, { Fragment, useEffect, useState } from "react";

import { Outlet, useParams, useNavigate } from "react-router-dom";

import teamsApi from "apis/teams";
import Loader from "common/Loader/index";
import { MobileEditHeader } from "common/Mobile/MobileEditHeader";
import { useTeamDetails } from "context/TeamDetailsContext";
import { useUserContext } from "context/UserContext";
import { teamsMapper } from "mapper/teams.mapper";

import MobilePersonalDetails from "./MobilePersonalDetails";
import StaticPage from "./StaticPage";

const PersonalDetails = () => {
  const { memberId } = useParams();
  const { isDesktop } = useUserContext();
  const {
    updateDetails,
    details: { personalDetails },
  } = useTeamDetails();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getDetails = async () => {
    const res: any = await teamsApi.get(memberId);
    const addRes = await teamsApi.getAddress(memberId);
    const teamsObj = teamsMapper(res.data, addRes.data.addresses[0]);
    updateDetails("personal", teamsObj);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    getDetails();
  }, []);

  return (
    <Fragment>
      {isDesktop && (
        <Fragment>
          <div className="flex items-center justify-between bg-miru-han-purple-1000 px-10 py-4">
            <h1 className="text-2xl font-bold text-white">Personal Details</h1>
            <button
              className="cursor-pointer rounded-md border border-white bg-miru-han-purple-1000 px-6 py-2 font-bold text-white"
              onClick={() =>
                navigate(`/team/${memberId}/edit`, { replace: true })
              }
            >
              Edit
            </button>
          </div>
          {isLoading ? (
            <div className="flex min-h-70v items-center justify-center">
              <Loader />
            </div>
          ) : (
            <StaticPage personalDetails={personalDetails} />
          )}
        </Fragment>
      )}
      {!isDesktop && (
        <Fragment>
          <MobileEditHeader
            backHref={`/team/${memberId}/options`}
            href={`/team/${memberId}/edit`}
            title="Personal Details"
          />
          {isLoading ? (
            <div className="flex min-h-70v items-center justify-center">
              <Loader />
            </div>
          ) : (
            <MobilePersonalDetails personalDetails={personalDetails} />
          )}
        </Fragment>
      )}
      <Outlet />
    </Fragment>
  );
};

export default PersonalDetails;
