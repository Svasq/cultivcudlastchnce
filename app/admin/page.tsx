import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const AdminPage = () => {
  const feedbackData = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      message: "This is a great website!",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      message: "I have some suggestions for improvement.",
    },
  ];

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <section>
        <h2>User Feedback</h2>
        <Table>
          <TableCaption>A list of user feedback.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbackData.map((feedback) => (
              <TableRow key={feedback.id}>
                <TableCell className="font-medium">{feedback.id}</TableCell>
                <TableCell>{feedback.name}</TableCell>
                <TableCell>{feedback.email}</TableCell>
                <TableCell>{feedback.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
      <section>
        <h2>Users</h2>
        {/* User data will be displayed here */}
      </section>
    </div>
  );
};

export default AdminPage;
