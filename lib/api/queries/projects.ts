import { Params } from '..';
import * as mappers from '../mappers';
import { project, Project, ProjectAssociations } from '~/lib/records';
import { recordEndpoints } from '~/lib/api/queries/lib/records';

export const record = recordEndpoints<
  Project,
  ProjectAssociations
  >({
    entity: 'projects',
    paramName: 'project',
    mapRecord: project.mapRecord,
    mapAssociations: project.mapAssociations,
  });

export function searchAssociated (params?: Params) {
  return {
    path: '/projects?assoc=1',
    params,
    mapper: (payload: any) => mappers.associatedRecords<Project>(payload),
  };
}
