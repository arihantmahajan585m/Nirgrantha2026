export function generateStudentTemplate(): string {
  const headers = [
    "name",
    "rollNumber",
    "branch",
    "semester",
    "email",
    "phone",
  ];
  const sampleRows = [
    [
      "Arjun Sharma",
      "CSE2024001",
      "CSE",
      "4",
      "arjun.sharma@college.edu",
      "9876543210",
    ],
    [
      "Priya Patel",
      "IT2024002",
      "IT",
      "3",
      "priya.patel@college.edu",
      "9876543211",
    ],
    [
      "Rahul Verma",
      "ECE2024003",
      "ECE",
      "5",
      "rahul.verma@college.edu",
      "9876543212",
    ],
  ];
  const lines = [headers.join(","), ...sampleRows.map((r) => r.join(","))];
  return lines.join("\n");
}

export function generateTeacherTemplate(): string {
  const headers = ["name", "department", "subject", "email", "employeeId"];
  const sampleRows = [
    [
      "Dr. Priya Sharma",
      "CSE",
      "Data Structures",
      "priya.sharma@college.edu",
      "EMP001",
    ],
    [
      "Prof. Rajesh Kumar",
      "IT",
      "Web Technologies",
      "rajesh.kumar@college.edu",
      "EMP002",
    ],
    [
      "Dr. Anita Patel",
      "ECE",
      "Digital Electronics",
      "anita.patel@college.edu",
      "EMP003",
    ],
  ];
  const lines = [headers.join(","), ...sampleRows.map((r) => r.join(","))];
  return lines.join("\n");
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
