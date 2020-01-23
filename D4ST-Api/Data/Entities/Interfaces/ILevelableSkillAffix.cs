namespace D4St_Api.Data.Entities.Interfaces
{
    public interface ILevelableSkillAffix
    {
        int Id { get; set; }
        int Level { get; set; }
        Skill Skill { get; set; }
    }
}
