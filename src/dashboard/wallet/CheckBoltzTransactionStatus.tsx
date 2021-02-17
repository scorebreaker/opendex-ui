import {
  createStyles,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Theme,
  Tooltip,
  Typography,
} from "@material-ui/core";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import React, { ReactElement } from "react";
import Code from "../../common/components/data-display/text/Code";
import { copyToClipboard } from "../../common/utils/appUtil";

type CheckBoltzTransactionStatusProps = {
  currency: string;
  id: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    row: {
      paddingTop: theme.spacing(1),
    },
    iconContainer: {
      display: "flex",
      alignItems: "center",
    },
  })
);

const CheckBoltzTransactionStatus = (
  props: CheckBoltzTransactionStatusProps
): ReactElement => {
  const { currency, id } = props;
  const classes = useStyles();
  const command = `boltzcli ${currency} swapinfo ${id}`;

  return (
    <Grid item container direction="column" justify="center">
      <Divider />
      <Grid item container justify="center" className={classes.row}>
        <Typography variant="caption">
          To check status, open the Console tab and run
        </Typography>
      </Grid>
      <Grid
        item
        container
        justify="center"
        alignItems="center"
        className={classes.row}
        spacing={1}
      >
        <Grid item>
          <Code text={command} backgroundColor="default" />
        </Grid>
        <Grid item className={classes.iconContainer}>
          <Tooltip title="Copy">
            <IconButton onClick={() => copyToClipboard(command)}>
              <FileCopyOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CheckBoltzTransactionStatus;
