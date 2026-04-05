import { useQuery } from "@tanstack/react-query";
import type { Student, Teacher } from "../backend";
import { useActor } from "./useActor";

export function useListAllStudents() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Student[]>({
    queryKey: ["allStudents"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllStudents();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useListAllTeachers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Teacher[]>({
    queryKey: ["allTeachers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllTeachers();
    },
    enabled: !!actor && !actorFetching,
  });
}
