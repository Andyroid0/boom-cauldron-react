/* eslint-disable @shopify/jsx-no-hardcoded-content */
import { Typography } from "@mui/material";
import { useShallow } from "zustand/react/shallow";
import { FC } from "react";

import Background from "../Background";
import useStateStore from "../../context/useStateStore";

interface LoadingViewProps {
  override?: boolean;
}

const LoadingView: FC<LoadingViewProps> = (props) => {
  const { override } = props;
  const { loading } = useStateStore(
    useShallow((state) => ({
      loading: state.loading,
    })),
  );

  if (!loading && !override) return <></>;
  return (
    <div style={{ opacity: 100 }}>
      <Background>
        <Typography variant="h2" className="letter">
          L
        </Typography>
        <Typography variant="h2" className="letter">
          o
        </Typography>
        <Typography variant="h2" className="letter">
          a
        </Typography>
        <Typography variant="h2" className="letter">
          d
        </Typography>
        <Typography variant="h2" className="letter">
          i
        </Typography>
        <Typography variant="h2" className="letter">
          n
        </Typography>
        <Typography variant="h2" className="letter">
          g
        </Typography>
        <Typography variant="h2" className="letter">
          .
        </Typography>
        <Typography variant="h2" className="letter">
          .
        </Typography>
        <Typography variant="h2" className="letter">
          .
        </Typography>
      </Background>
    </div>
  );
};

export default LoadingView;
