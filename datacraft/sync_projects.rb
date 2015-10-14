require './config/environment'
require './datacraft/model_plugins/project_plugin'

Project.send(:include, ProjectPlugin)

class ProjectProfiles
  def each
    Project.scan_for_projects.each do |f|
      yield f
    end
  end
end

class ProjectData
  def <<(row)
    Project.sync(row)
  end
end

from ProjectProfiles

to ProjectData
