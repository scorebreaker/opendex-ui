import { createStyles, withStyles, WithStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { inject, observer } from "mobx-react";
import React, { ReactElement } from "react";
import { withRouter } from "react-router-dom";
import api from "../../api";
import PageLoader from "../../common/components/data-display/loader/PageLoader";
import { Status } from "../../models/Status";
import DashboardContent, {
  DashboardContentProps,
  DashboardContentState,
} from "../DashboardContent";
import OverviewItem from "./OverviewItem";

type PropsType = DashboardContentProps & WithStyles<typeof styles>;

type StateType = DashboardContentState & {
  statuses?: Status[];
};

const styles = () => {
  return createStyles({
    wrapper: {
      overflowY: "auto",
    },
  });
};

@inject((stores) => ({
  serviceStore: (stores as any).serviceStore,
}))
@observer
class Overview extends DashboardContent<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = { statuses: undefined };
    this.refreshableData.push({
      queryFn: api.status$,
      stateProp: "statuses",
      isStatusQuery: true,
    });
  }

  sortingOrderByService = (service: string): number => {
    if (service === "opendexd") {
      return 0;
    }
    if (["lndbtc", "lndltc", "connext"].includes(service)) {
      return 1;
    }
    if (["bitcoind", "litecoind", "geth"].includes(service)) {
      return 2;
    }
    return 3;
  };

  statusFilter = (status: Status): boolean => {
    return status.status !== "Disabled";
  };

  render(): ReactElement {
    const { classes } = this.props;

    return (
      <Grid container spacing={5} className={classes.wrapper}>
        {this.state.initialLoadCompleted ? (
          this.state.statuses &&
          this.state.statuses
            .filter(this.statusFilter)
            .sort(
              (a, b) =>
                this.sortingOrderByService(a.service) -
                this.sortingOrderByService(b.service)
            )
            .map((status) => (
              <OverviewItem
                status={status}
                key={status.service}
                opendexdLocked={this.state.opendexdLocked}
                opendexdNotReady={this.state.opendexdNotReady}
              ></OverviewItem>
            ))
        ) : (
          <PageLoader />
        )}
      </Grid>
    );
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(Overview));
