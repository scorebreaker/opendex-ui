import {
  Button,
  createStyles,
  FormControl,
  InputAdornment,
  InputLabel,
  makeStyles,
  OutlinedInput,
  Theme,
  Typography,
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import React, { ReactElement, useEffect, useState } from "react";
import {
  coinsToSats,
  satsToCoins,
  satsToCoinsStr,
} from "../../common/currencyUtil";
import NumberInput from "../../common/NumberInput";
import { GetServiceInfoResponse } from "../../models/GetServiceInfoResponse";
import { getMaxWithdrawAmount, isAmountBetweenLimits } from "./walletUtil";

type WithdrawAmountProps = {
  currency: string;
  channelBalance: number;
  serviceInfo: GetServiceInfoResponse;
  onNext: (amount: number) => void;
  initialAmountInSats?: number;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    row: {
      padding: `${theme.spacing(2)}px 0px`,
    },
  })
);

const WithdrawAmount = (props: WithdrawAmountProps): ReactElement => {
  const {
    currency,
    channelBalance,
    serviceInfo,
    onNext,
    initialAmountInSats,
  } = props;
  const [amount, setAmount] = useState<string>("");
  const inputId = `withdraw-${currency}-amount`;
  const classes = useStyles();

  useEffect(() => {
    setAmount(
      initialAmountInSats ? satsToCoins(initialAmountInSats).toString() : ""
    );
  }, [initialAmountInSats]);

  return (
    <>
      <FormControl variant="outlined">
        <InputLabel htmlFor={inputId}>Amount</InputLabel>
        <OutlinedInput
          id={inputId}
          labelWidth={60}
          value={amount || ""}
          onChange={(event) => {
            setAmount(event.target.value);
          }}
          inputComponent={NumberInput as any}
          inputProps={{ decimalScale: 8 }}
          endAdornment={
            <InputAdornment position="end">{currency}</InputAdornment>
          }
        />
      </FormControl>

      {channelBalance < Number(serviceInfo.limits.minimal) ? (
        <Typography
          className={classes.row}
          variant="body2"
          color="error"
          align="center"
        >
          Minimal withdrawal amount is{" "}
          <strong>
            {satsToCoinsStr(serviceInfo.limits.minimal, currency)}
          </strong>
          , your Layer 2 balance is{" "}
          <strong>{satsToCoinsStr(channelBalance, currency)}</strong>
        </Typography>
      ) : (
        <Typography className={classes.row} variant="body2" align="center">
          Range: {<strong>{satsToCoinsStr(serviceInfo.limits.minimal)}</strong>}{" "}
          to{" "}
          {
            <strong>
              {satsToCoinsStr(
                getMaxWithdrawAmount(channelBalance, serviceInfo.limits),
                currency
              )}
            </strong>
          }
        </Typography>
      )}
      <Button
        endIcon={<ArrowForwardIcon />}
        color="primary"
        disableElevation
        variant="contained"
        onClick={() => onNext(coinsToSats(amount))}
        disabled={
          isNaN(Number.parseFloat(amount)) ||
          !isAmountBetweenLimits(
            coinsToSats(amount),
            channelBalance,
            serviceInfo.limits
          )
        }
      >
        Next
      </Button>
    </>
  );
};

export default WithdrawAmount;
