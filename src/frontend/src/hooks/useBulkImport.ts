import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Student, Teacher } from "../backend";
import { useActor } from "./useActor";

export function useBulkAddStudents() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (students: Student[]) => {
      if (!actor) throw new Error("Actor not available");
      await actor.bulkAddStudents(students);
      return students.length;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["allStudents"] });
    },
  });
}

export function useBulkAddTeachers() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teachers: Teacher[]) => {
      if (!actor) throw new Error("Actor not available");
      await actor.bulkAddTeachers(teachers);
      return teachers.length;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["allTeachers"] });
    },
  });
}
