import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select } from "@/components/select";

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";

export const useSelectAccount = ():[() => JSX.Element, () => Promise<unknown>] => {
  const accountQuery = useGetAccounts();
  const acountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => acountMutation.mutate({ name });
  const accountOptions = (accountQuery.data || []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const [promise, setPromise] = useState<{
    resolve: (value: string | undefined) => void;
  } | null>(null);
  const selectValue = useRef<string>();

  const confirm = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(selectValue.current);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(undefined);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Account</DialogTitle>
          <DialogDescription>
            Please select an account to continue.
          </DialogDescription>
          <Select
            placeholder="Select an Account"
            options={accountOptions}
            onCreate={onCreateAccount}
            onChange={(value) => (selectValue.current = value)}
            disabled={accountQuery.isLoading || acountMutation.isPending}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={handleCancel}>
              Cancle
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirm];
};
