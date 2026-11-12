import type { ModelDefinition } from './model-types.ts';
export const dynamicsGroups = [
 {id:'inclined-plane',title:'Inclined Plane',members:['inclined-plane','book-normal-force','book-slope-component','book-slope-geometry','book-slope-raising','book-slope-lowering','book-slope-acceleration'],modes:[['inclined-plane','Geometry & speed'],['book-normal-force','Normal force'],['book-slope-component','Downhill gravity component'],['book-slope-raising','Uniform raising'],['book-slope-lowering','Downhill force'],['book-slope-acceleration','Acceleration & friction']]},
 {id:'book-force',title:'Force, Mass & Acceleration',members:['book-force','book-weight'],modes:[['book-force','Net force'],['book-weight','Weight']]},
 {id:'book-pulley-force',title:'Ideal Pulleys',members:['book-pulley-force','book-pulley-distance'],modes:[['book-pulley-force','Force transmission'],['book-pulley-distance','Rope & load travel']]}
] as const;
/** Group only the presentation. Original IDs, inverse definitions and reference tests remain intact. */
export function groupDynamicsModels(models:readonly ModelDefinition[]):ModelDefinition[]{
 const consumed=new Set<string>(dynamicsGroups.flatMap(group=>[...group.members]));
 const grouped=dynamicsGroups.map(group=>{
  const members=group.members.map(id=>models.find(model=>model.id===id)).filter((model):model is ModelDefinition=>!!model);
  const unique=<T>(items:readonly T[])=>[...new Map(items.map(item=>[JSON.stringify(item),item])).values()];
  return {...members[0],id:group.id,title:group.title,calculator:'dynamics' as const,variables:unique(members.flatMap(model=>[...model.variables])),formulas:unique(members.flatMap(model=>[...model.formulas])),notes:unique(members.flatMap(model=>[...(model.notes??[])])),references:unique(members.flatMap(model=>[...(model.references??[])]))};
 });
 return [grouped[0],grouped[1],...models.filter(model=>!consumed.has(model.id)),grouped[2]];
}
