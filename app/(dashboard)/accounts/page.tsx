"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/datatable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewAccount } from "@/features/hooks/use-new-account";
import { Plus } from "lucide-react";

import { Payment,columns } from "./column";

const data: Payment[]= [
    {
        id: "12335",
        amount: 123,
        status: "pending",
        email: "tr324@gmail.cin",
      },
]

const AccountPage = () => {
  const newAccount = useNewAccount();
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Accounts Page</CardTitle>
          <Button onClick={newAccount.onOpen} size="sm">
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
        <DataTable filterKey="email" columns={columns} data={data} onDelete={() => {}} disable={false}/>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountPage;
